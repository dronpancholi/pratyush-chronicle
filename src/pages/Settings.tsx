import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Palette, 
  FileText, 
  Activity, 
  Shield, 
  Settings as SettingsIcon,
  Save,
  LogOut,
  Trash2,
  Crown,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Edit3,
  Check,
  X,
  Bell,
  Languages,
  Eye,
  Download,
  Filter,
  Star,
  MessageSquare,
  Hash,
  Search,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    semester: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New features state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newsletter: true,
    announcements: true
  });
  const [language, setLanguage] = useState('en');
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false
  });
  const [accessibility, setAccessibility] = useState({
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false
  });
  
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
        semester: profile.semester?.toString() || ''
      });
    }
    
    if (user) {
      fetchUserActivity();
      loadUserPreferences();
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

      if (submissionsError) {
        console.error('Submissions fetch error:', submissionsError);
      } else {
        setSubmissions(submissionsData || []);
      }

      // Fetch user feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Feedback fetch error:', feedbackError);
      } else {
        setUserFeedback(feedbackData || []);
      }

      // Fetch user reactions
      const { data: reactionsData, error: reactionsError } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reactionsError) {
        console.error('Reactions fetch error:', reactionsError);
      } else {
        setUserReactions(reactionsData || []);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const handleProfileSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updateData = {
        full_name: profileData.full_name,
        phone: profileData.phone,
        department: profileData.department,
        semester: profileData.semester ? parseInt(profileData.semester) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updateData
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Profile save error:', error);
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Profile saved",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Profile save failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    // Load preferences from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    const savedLanguage = localStorage.getItem('language');
    const savedPrivacy = localStorage.getItem('privacy');
    const savedAccessibility = localStorage.getItem('accessibility');

    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
    if (savedAccessibility) setAccessibility(JSON.parse(savedAccessibility));
  };

  const savePreferences = (type: string, data: any) => {
    localStorage.setItem(type, JSON.stringify(data));
    toast({
      title: "Preferences saved",
      description: `Your ${type} preferences have been updated.`,
    });
  };

  const exportData = async () => {
    try {
      const userData = {
        profile: profileData,
        submissions,
        feedback: userFeedback,
        reactions: userReactions,
        exportedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pratyush-club-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
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
        .eq('id', feedbackId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setUserFeedback(prev => prev.filter(f => f.id !== feedbackId));
      toast({
        title: "Feedback deleted",
        description: "Your feedback has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete feedback",
        variant: "destructive"
      });
    }
  };

  const handleRemoveReaction = async (reactionId: string) => {
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', reactionId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setUserReactions(prev => prev.filter(r => r.id !== reactionId));
      toast({
        title: "Reaction removed",
        description: "Your reaction has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove reaction",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>You need to be signed in to access your settings.</CardDescription>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 h-auto p-1">
              <TabsTrigger value="profile" className="flex items-center gap-2 h-10">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2 h-10">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2 h-10">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2 h-10">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2 h-10">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">Access</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2 h-10">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 h-10">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              {profile?.role === 'admin' && (
                <TabsTrigger value="admin" className="flex items-center gap-2 h-10">
                  <Crown className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Manage your personal information and avatar
                      </CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="shrink-0"
                    >
                      {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* User Info Section */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 border-4 border-background shadow-lg mb-4">
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/40">
                          {profileData.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {profile?.role && (
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                          {profile.role.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {profileData.full_name || user.email}
                        </h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {profileData.department && (
                            <Badge variant="outline">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {profileData.department}
                            </Badge>
                          )}
                          {profileData.semester && (
                            <Badge variant="outline">
                              <GraduationCap className="h-3 w-3 mr-1" />
                              Semester {profileData.semester}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="full-name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email (Read-only)
                      </Label>
                      <Input
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Enter your department"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Semester
                      </Label>
                      <Input
                        id="semester"
                        type="number"
                        min="1"
                        max="8"
                        value={profileData.semester}
                        onChange={(e) => setProfileData(prev => ({ ...prev, semester: e.target.value }))}
                        placeholder="Enter semester"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Account Created
                      </Label>
                      <Input
                        value={new Date(user.created_at).toLocaleDateString()}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProfileSave}
                          disabled={loading}
                          className="min-w-[120px]"
                        >
                          {loading ? (
                            "Saving..."
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how the application looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Theme Mode</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: '☀️', desc: 'Clean and bright' },
                        { value: 'dark', label: 'Dark', icon: '🌙', desc: 'Easy on the eyes' },
                        { value: 'system', label: 'System', icon: '💻', desc: 'Follows your device' }
                      ].map((option) => (
                        <Card
                          key={option.value}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            theme === option.value 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setTheme(option.value as any)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <h3 className="font-medium">{option.label}</h3>
                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Developer Contact</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">dronpancholi@gmail.com</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Support:</span>
                          <span className="ml-2">8780855565</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle>Your Submissions</CardTitle>
                  <CardDescription>
                    Track and manage your submitted content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground mb-4">Share your achievements with the community</p>
                      <Button asChild>
                        <Link to="/submit">Submit Your Achievement</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <Card key={submission.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-medium text-lg">{submission.title}</h3>
                              <Badge variant={
                                submission.status === 'approved' ? 'default' :
                                submission.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {submission.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{submission.summary}</p>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {submission.category}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(submission.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab - New Feature */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => {
                          const newNotifications = { ...notifications, email: checked };
                          setNotifications(newNotifications);
                          savePreferences('notifications', newNotifications);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Newsletter Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about new newsletters</p>
                      </div>
                      <Switch
                        checked={notifications.newsletter}
                        onCheckedChange={(checked) => {
                          const newNotifications = { ...notifications, newsletter: checked };
                          setNotifications(newNotifications);
                          savePreferences('notifications', newNotifications);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Announcements</Label>
                        <p className="text-sm text-muted-foreground">Important club announcements</p>
                      </div>
                      <Switch
                        checked={notifications.announcements}
                        onCheckedChange={(checked) => {
                          const newNotifications = { ...notifications, announcements: checked };
                          setNotifications(newNotifications);
                          savePreferences('notifications', newNotifications);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                  <CardDescription>
                    Set your preferred language and regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={language}
                        onValueChange={(value) => {
                          setLanguage(value);
                          savePreferences('language', value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                          <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab - New Feature */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and what others can see
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(checked) => {
                          const newPrivacy = { ...privacy, profileVisible: checked };
                          setPrivacy(newPrivacy);
                          savePreferences('privacy', newPrivacy);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Activity Tracking</Label>
                        <p className="text-sm text-muted-foreground">Allow tracking of your activity for analytics</p>
                      </div>
                      <Switch
                        checked={privacy.activityVisible}
                        onCheckedChange={(checked) => {
                          const newPrivacy = { ...privacy, activityVisible: checked };
                          setPrivacy(newPrivacy);
                          savePreferences('privacy', newPrivacy);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessibility Tab - New Feature */}
            <TabsContent value="accessibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Accessibility Options
                  </CardTitle>
                  <CardDescription>
                    Customize the interface for better accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select
                        value={accessibility.fontSize}
                        onValueChange={(value) => {
                          const newAccessibility = { ...accessibility, fontSize: value };
                          setAccessibility(newAccessibility);
                          savePreferences('accessibility', newAccessibility);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium (Default)</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">High Contrast Mode</Label>
                        <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                      </div>
                      <Switch
                        checked={accessibility.highContrast}
                        onCheckedChange={(checked) => {
                          const newAccessibility = { ...accessibility, highContrast: checked };
                          setAccessibility(newAccessibility);
                          savePreferences('accessibility', newAccessibility);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Reduce Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                      </div>
                      <Switch
                        checked={accessibility.reduceMotion}
                        onCheckedChange={(checked) => {
                          const newAccessibility = { ...accessibility, reduceMotion: checked };
                          setAccessibility(newAccessibility);
                          savePreferences('accessibility', newAccessibility);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management Tab - New Feature */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Export, backup, and manage your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <Download className="h-8 w-8 mx-auto text-primary" />
                          <h3 className="font-medium">Export Your Data</h3>
                          <p className="text-sm text-muted-foreground">
                            Download all your data in JSON format
                          </p>
                          <Button onClick={exportData} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <Activity className="h-8 w-8 mx-auto text-blue-500" />
                          <h3 className="font-medium">Activity Summary</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center">
                              <div className="font-bold text-lg">{submissions.length}</div>
                              <div className="text-muted-foreground">Submissions</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg">{userFeedback.length}</div>
                              <div className="text-muted-foreground">Reviews</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feedback Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Feedback</CardTitle>
                    <CardDescription>Reviews and ratings you've submitted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userFeedback.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No feedback submitted yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userFeedback.map((feedback) => (
                          <Card key={feedback.id} className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
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
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {feedback.review && (
                                <p className="text-sm mb-2">{feedback.review}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {new Date(feedback.created_at).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Reactions Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Reactions</CardTitle>
                    <CardDescription>Items you've liked or reacted to</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userReactions.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No reactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userReactions.map((reaction) => (
                          <Card key={reaction.id} className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
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
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Account Created:</span>
                          <span className="text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Last Sign In:</span>
                          <span className="text-sm font-medium">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-orange-800 dark:text-orange-200">Password Reset</h3>
                              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                                Send a password reset email to update your credentials
                              </p>
                              <Button 
                                onClick={handlePasswordReset} 
                                variant="outline" 
                                size="sm"
                                className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900"
                              >
                                Reset Password
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <LogOut className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-red-800 dark:text-red-200">Sign Out</h3>
                              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                                Sign out of your account on this device
                              </p>
                              <Button 
                                onClick={signOut} 
                                variant="destructive" 
                                size="sm"
                              >
                                Sign Out
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Tab */}
            {profile?.role === 'admin' && (
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Admin Tools
                    </CardTitle>
                    <CardDescription>
                      Administrative functions and quick access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3">
                        <Link to="/admin">
                          <Crown className="h-8 w-8" />
                          <div className="text-center">
                            <div className="font-medium">Admin Dashboard</div>
                            <div className="text-sm text-muted-foreground">Main admin panel</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3">
                        <Link to="/admin">
                          <FileText className="h-8 w-8" />
                          <div className="text-center">
                            <div className="font-medium">Manage Submissions</div>
                            <div className="text-sm text-muted-foreground">Review and approve</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="h-auto p-6 flex-col gap-3">
                        <Link to="/admin">
                          <User className="h-8 w-8" />
                          <div className="text-center">
                            <div className="font-medium">View Feedback</div>
                            <div className="text-sm text-muted-foreground">User feedback</div>
                          </div>
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
    </div>
  );
};

export default Settings;