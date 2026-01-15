import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Submit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: '',
    department: '',
    semester: '',
    external_link: '',
    submitter_name: '',
    submitter_email: '',
    consent: false,
    media_url: ''
  });

  const categories = [
    'Achievement',
    'Talent',
    'Project', 
    'Competition',
    'Innovation',
    'Research',
    'Community Service',
    'Other'
  ];

  const departments = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Automobile Engineering',
    'Production Engineering',
    'Instrumentation & Control',
    'Biomedical Engineering',
    'Textile Technology',
    'Plastic & Polymer Technology',
    'Rubber Technology'
  ];

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('submissions-media')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('submissions-media')
        .getPublicUrl(fileName);

      setFormData({ ...formData, media_url: data.publicUrl });
      
      toast({
        title: "Media uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to the terms before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        title: formData.title,
        description: formData.summary,
        summary: formData.summary,
        category: formData.category,
        department: formData.department,
        semester: formData.semester ? parseInt(formData.semester) : null,
        external_link: formData.external_link || null,
        student_name: formData.submitter_name || user?.email || 'Anonymous',
        submitter_name: formData.submitter_name || user?.email || 'Anonymous',
        submitter_email: formData.submitter_email || user?.email || null,
        email: formData.submitter_email || user?.email || null,
        media_url: formData.media_url || null
      };

      const { error } = await supabase
        .from('submissions')
        .insert([submissionData]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Submission received",
        description: "Thank you! Your submission is under review.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold">Submission Received!</h2>
              <p className="text-muted-foreground">
                Thank you for sharing your work! Our team will review your submission and it will appear in the Students' section once approved.
              </p>
              <div className="space-y-2">
                <Link to="/students">
                  <Button className="w-full">View Students' Section</Button>
                </Link>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full">
                  Submit Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Share Your Achievement
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Showcase your talents, projects, achievements, and more with the GPA community
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Submission Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Give your submission a catchy title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="semester">Semester (optional)</Label>
                    <Input
                      id="semester"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="submitter_name">Your Name *</Label>
                    <Input
                      id="submitter_name"
                      value={formData.submitter_name}
                      onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="submitter_email">Your Email (optional)</Label>
                    <Input
                      id="submitter_email"
                      type="email"
                      value={formData.submitter_email}
                      onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="external_link">Project/Portfolio Link (optional)</Label>
                    <Input
                      id="external_link"
                      type="url"
                      value={formData.external_link}
                      onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                      placeholder="https://your-project.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="summary">Description *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    required
                    placeholder="Describe your achievement, project, or talent in detail..."
                    className="min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="media-upload">Upload Image/Video (optional, max 10MB)</Label>
                  <div className="mt-2">
                    <Label htmlFor="media-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        {uploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                            Uploading...
                          </div>
                        ) : formData.media_url ? (
                          <div className="space-y-2">
                            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                              <img 
                                src={formData.media_url} 
                                alt="Uploaded" 
                                className="max-w-full max-h-full object-contain rounded-lg"
                              />
                            </div>
                            <p className="text-sm text-green-600">File uploaded successfully</p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload image or video</p>
                          </div>
                        )}
                      </div>
                    </Label>
                    <Input
                      id="media-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked === true })}
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed">
                    I consent to sharing this information publicly on the Pratyush Newsletter website and understand that it will be visible to all visitors.
                  </Label>
                </div>

                <Alert>
                  <AlertDescription>
                    Your submission will be reviewed by our team before being published in the Students' section.
                  </AlertDescription>
                </Alert>

                <Button type="submit" disabled={loading || !formData.consent} className="w-full">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit for Review'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Submit;