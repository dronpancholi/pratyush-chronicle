import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Palette, 
  FileText, 
  ThumbsUp, 
  Shield, 
  Settings as SettingsIcon,
  Upload,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Edit,
  Mail,
  Phone,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/providers/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  summary: string;
}

interface UserFeedback {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
}

interface UserReaction {
  id: string;
  entity_type: string;
  entity_id: string;
  reaction: string;
  created_at: string;
}

const Settings = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    department: '',
    semester: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // User activity data
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [userReactions, setUserReactions] = useState<UserReaction[]>([]);
  
  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        department: profile.department || '',
        semester: profile.semester?.toString() || '',
        avatar_url: profile.avatar_url || ''
      });
    }
    
    if (user) {
      fetchUserActivity();
    }
  }, [profile, user]);

  const fetchUserActivity = async () => {
    if (!user) return;

    try {
      // Fetch user submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('submitter_email', user.email)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);

      // Fetch user feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;
      setUserFeedback(feedbackData || []);

      // Fetch user reactions
      const { data: reactionsData, error: reactionsError } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reactionsError) throw reactionsError;
      setUserReactions(reactionsData || []);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          department: profileData.department,
          semester: profileData.semester ? parseInt(profileData.semester) : null,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;

    const file = event.target.files[0];
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileData(prev => ({ ...prev, avatar_url: data.publicUrl }));
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been uploaded successfully. Don't forget to save your profile.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;

      setUserFeedback(prev => prev.filter(f => f.id !== feedbackId));
      toast({
        title: "Feedback deleted",
        description: "Your feedback has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRemoveReaction = async (reactionId: string) => {
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', reactionId);

      if (error) throw error;

      setUserReactions(prev => prev.filter(r => r.id !== reactionId));
      toast({
        title: "Reaction removed",
        description: "Your reaction has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be logged in to access settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and activity
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {profile?.role === 'admin' && (
              <TabsTrigger value="admin">Admin Tools</TabsTrigger>
            )}
          </TabsList>

          {/* Profile Management */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback>
                      {profileData.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" disabled={uploading} asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload Avatar'}
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Max 2MB, will be resized to 512px
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Enter your department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      type="number"
                      min="1"
                      max="8"
                      value={profileData.semester}
                      onChange={(e) => setProfileData(prev => ({ ...prev, semester: e.target.value }))}
                      placeholder="Enter your semester"
                    />
                  </div>
                  {profile?.role && (
                    <div>
                      <Label>Role</Label>
                      <div className="mt-1">
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                          {profile.role}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
                  </p>
                  <Button onClick={handleProfileUpdate} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme & Preferences */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Preferences</CardTitle>
                <CardDescription>
                  Customize your visual experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Theme Mode</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {[
                      { value: 'light', label: 'Light', icon: '☀️' },
                      { value: 'dark', label: 'Dark', icon: '🌙' },
                      { value: 'system', label: 'System', icon: '🖥️' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={theme === option.value ? 'default' : 'outline'}
                        onClick={() => setTheme(option.value as any)}
                        className="justify-start"
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Developer Contact: dronpancholi@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Support Phone: 8780855565</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Management */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Your Submissions</CardTitle>
                <CardDescription>
                  Manage your submitted content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No submissions yet</p>
                    <Button asChild className="mt-4">
                      <Link to="/submit">Submit Your Achievement</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{submission.title}</h3>
                          <Badge variant={
                            submission.status === 'approved' ? 'default' :
                            submission.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{submission.summary}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Category: {submission.category}</span>
                          <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity (Feedback & Reactions) */}
          <TabsContent value="activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Feedback</CardTitle>
                  <CardDescription>Feedback you've submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  {userFeedback.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No feedback submitted</p>
                  ) : (
                    <div className="space-y-3">
                      {userFeedback.map((feedback) => (
                        <div key={feedback.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {feedback.review && (
                            <p className="text-sm text-muted-foreground">{feedback.review}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Reactions</CardTitle>
                  <CardDescription>Items you've liked</CardDescription>
                </CardHeader>
                <CardContent>
                  {userReactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No reactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {userReactions.map((reaction) => (
                        <div key={reaction.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                {reaction.reaction === 'like' ? '👍' : reaction.reaction} {reaction.entity_type}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(reaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveReaction(reaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Created:</span>
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sign In:</span>
                      <span>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button onClick={handlePasswordReset} variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  
                  <Button onClick={signOut} variant="destructive" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tools */}
          {profile?.role === 'admin' && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Tools</CardTitle>
                  <CardDescription>
                    Quick access to administrative functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link to="/admin" className="flex flex-col items-center space-y-2">
                        <Crown className="h-6 w-6" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link to="/admin" className="flex flex-col items-center space-y-2">
                        <FileText className="h-6 w-6" />
                        <span>Manage Submissions</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link to="/admin" className="flex flex-col items-center space-y-2">
                        <User className="h-6 w-6" />
                        <span>View Feedback</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;