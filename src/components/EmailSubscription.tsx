import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Bell, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailSubscription = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    department: '',
    semester: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.phone || !formData.department) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-email', {
        body: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          semester: formData.semester ? parseInt(formData.semester) : null
        }
      });

      if (error) throw error;
      
      setSuccess(true);
      setFormData({ email: '', name: '', phone: '', department: '', semester: '' });
    } catch (error: any) {
      setError(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="text-center border-primary/20">
              <CardContent className="pt-8 pb-8">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Successfully Subscribed!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for subscribing to the Pratyush Newsletter. 
                  You'll receive notifications when new issues are published.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="academic-card border-primary/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-4">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Stay Updated</CardTitle>
              <p className="text-muted-foreground">
                Subscribe to receive email notifications when new newsletters are published
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department *" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Semester (optional)"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    min="1"
                    max="8"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Subscribe to Newsletter
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-medium text-foreground mb-4 text-center">What you'll receive:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Monthly newsletter release notifications
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Special announcements and updates
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Direct links to new content
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EmailSubscription;