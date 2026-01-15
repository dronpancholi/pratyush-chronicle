import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';
import { departments as departmentData } from '@/data/departments';
import SubmissionsManager from './SubmissionsManager';

interface DashboardProps {
  departments: typeof departmentData;
}

const Dashboard = ({ departments }: DashboardProps) => {
  const { user, profile, signOut } = useAuth();
  const { 
    issues, 
    departmentIssues, 
    loading, 
    uploading, 
    uploadGlobalNewsletter, 
    uploadDepartmentNewsletter,
    publishIssue,
    unpublishIssue 
  } = useIssues();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'global' | 'department'>('department');
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    summary: '',
    issueId: '',
    departmentId: profile?.department_id || '',
  });
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus({ type: null, message: '' });
    } else {
      setUploadStatus({ type: 'error', message: 'Please select a valid PDF file.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setUploadStatus({ type: null, message: '' });

    try {
      let result;
      
      if (uploadType === 'global' && ['admin', 'president'].includes(profile?.role)) {
        result = await uploadGlobalNewsletter(selectedFile, {
          year: formData.year,
          month: formData.month,
          title: formData.title,
        });
      } else if (uploadType === 'department') {
        if (!formData.issueId) {
          setUploadStatus({ type: 'error', message: 'Please select an issue to upload to.' });
          return;
        }
        
        result = await uploadDepartmentNewsletter(selectedFile, {
          issue_id: formData.issueId,
          department_id: formData.departmentId || profile?.department_id,
          summary: formData.summary,
        });
      }

      if (result?.error) {
        setUploadStatus({ type: 'error', message: result.error });
      } else {
        setUploadStatus({ type: 'success', message: 'Newsletter uploaded successfully!' });
        setSelectedFile(null);
        setFormData({ ...formData, title: '', summary: '' });
        // Reset file input
        const fileInput = document.getElementById('newsletter-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Upload failed' 
      });
    }
  };

  const handlePublishToggle = async (issueId: string, isPublished: boolean) => {
    try {
      const result = isPublished ? 
        await unpublishIssue(issueId) : 
        await publishIssue(issueId);
      
      if (result.error) {
        setUploadStatus({ type: 'error', message: result.error });
      } else {
        setUploadStatus({ 
          type: 'success', 
          message: `Issue ${isPublished ? 'unpublished' : 'published'} successfully!` 
        });
      }
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Action failed' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userDepartment = departments.find(d => d.id === profile?.department_id);
  const availableIssues = issues.filter(issue => 
    ['admin', 'president'].includes(profile?.role) || issue.published_at
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {profile?.full_name || user?.email}
              {userDepartment && ` • ${userDepartment.name}`}
            </p>
            <div className="flex items-center mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {profile?.role}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        {/* Upload Status */}
        {uploadStatus.type && (
          <Alert className={`mb-6 ${uploadStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertDescription className={uploadStatus.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {uploadStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Admin/President Tabs */}
        {['admin', 'president'].includes(profile?.role) ? (
          <Tabs defaultValue="newsletters" className="space-y-6">
            <TabsList>
              <TabsTrigger value="newsletters" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Newsletters
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="newsletters">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Newsletter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Upload Type Selection */}
                      <div className="space-y-2">
                        <Label>Upload Type</Label>
                        <Select value={uploadType} onValueChange={(value) => setUploadType(value as 'global' | 'department')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Global Newsletter</SelectItem>
                            <SelectItem value="department">Department Newsletter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Global Newsletter Fields */}
                      {uploadType === 'global' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Newsletter Title *</Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="Enter newsletter title"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="year">Year *</Label>
                              <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                min="2020"
                                max="2030"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="month">Month *</Label>
                              <Select value={formData.month.toString()} onValueChange={(value) => setFormData({ ...formData, month: parseInt(value) })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <SelectItem key={month} value={month.toString()}>
                                      {new Date(2023, month - 1).toLocaleString('default', { month: 'long' })}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Department Newsletter Fields */}
                      {uploadType === 'department' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="issue">Select Issue *</Label>
                            <Select value={formData.issueId} onValueChange={(value) => setFormData({ ...formData, issueId: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an issue" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableIssues.map(issue => (
                                  <SelectItem key={issue.id} value={issue.id}>
                                    {issue.title} ({issue.year}-{issue.month.toString().padStart(2, '0')})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="summary">Summary (Optional)</Label>
                            <Textarea
                              id="summary"
                              value={formData.summary}
                              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                              placeholder="Brief summary of your department's newsletter content"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="newsletter-file">PDF File *</Label>
                        <Input
                          id="newsletter-file"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required
                        />
                        {selectedFile && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>

                      <Button type="submit" disabled={!selectedFile || uploading} className="w-full">
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Newsletter
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Manage Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {issues.slice(0, 10).map(issue => (
                        <div key={issue.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {issue.year}-{issue.month.toString().padStart(2, '0')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {issue.published_at ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishToggle(issue.id, !!issue.published_at)}
                            >
                              {issue.published_at ? 'Unpublish' : 'Publish'}
                            </Button>
                          </div>
                        </div>
                      ))}
                      {issues.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No issues yet. Upload your first global newsletter!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="submissions">
              <SubmissionsManager />
            </TabsContent>
          </Tabs>
        ) : (
          /* Contributor/Editor view */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issue">Select Issue *</Label>
                      <Select value={formData.issueId} onValueChange={(value) => setFormData({ ...formData, issueId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an issue" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIssues.map(issue => (
                            <SelectItem key={issue.id} value={issue.id}>
                              {issue.title} ({issue.year}-{issue.month.toString().padStart(2, '0')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Summary (Optional)</Label>
                      <Textarea
                        id="summary"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Brief summary of your department's newsletter content"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newsletter-file">PDF File *</Label>
                    <Input
                      id="newsletter-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={!selectedFile || uploading} className="w-full">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Newsletter
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Department Submissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Your Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {departmentIssues
                    .filter(di => di.department_id === profile?.department_id)
                    .slice(0, 5)
                    .map(issue => (
                      <div key={issue.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium">{issue.department?.name}</p>
                          {issue.summary && (
                            <p className="text-sm text-muted-foreground">{issue.summary}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {issue.published_at ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  {departmentIssues.filter(di => di.department_id === profile?.department_id).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No submissions yet. Upload your first newsletter!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;