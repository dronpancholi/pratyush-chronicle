import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useNewsletters } from '@/hooks/useNewsletters';
import { Loader2, Upload, FileText, Plus } from 'lucide-react';

const Admin = () => {
  const { user, profile, signOut } = useAuth();
  const { newsletters, uploadNewsletter, loading: newslettersLoading } = useNewsletters();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_date: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    is_published: false,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Redirect if not authenticated or not admin/editor
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile && !['admin', 'editor'].includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a PDF file');
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await uploadNewsletter(selectedFile, formData);
      
      if (error) {
        setError(error);
      } else {
        setSuccess('Newsletter uploaded successfully!');
        setFormData({
          title: '',
          description: '',
          issue_date: new Date().toISOString().split('T')[0],
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          is_published: false,
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError('Failed to upload newsletter');
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.full_name || user.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Newsletter Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Upload New Newsletter</span>
              </CardTitle>
              <CardDescription>
                Upload a new newsletter issue PDF and set its details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Newsletter Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., January 2025 Issue"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this issue..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      min="2000"
                      max="2100"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="number"
                      value={formData.month}
                      onChange={(e) => setFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                      min="1"
                      max="12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pdf-file">Newsletter PDF</Label>
                  <Input
                    id="pdf-file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Newsletter
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Newsletters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Existing Newsletters</span>
              </CardTitle>
              <CardDescription>
                Manage published newsletter issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {newslettersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : newsletters.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No newsletters uploaded yet
                </p>
              ) : (
                <div className="space-y-4">
                  {newsletters.map((newsletter) => (
                    <div key={newsletter.id} className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-foreground">{newsletter.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(newsletter.issue_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      {newsletter.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {newsletter.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          newsletter.is_published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {newsletter.is_published ? 'Published' : 'Draft'}
                        </span>
                        {newsletter.pdf_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={newsletter.pdf_url} target="_blank" rel="noopener noreferrer">
                              View PDF
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
