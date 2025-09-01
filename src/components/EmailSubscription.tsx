import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Bell, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmailSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive notifications when new newsletters are published.",
      });
      
      // Reset after 3 seconds to allow multiple subscriptions for demo
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }, 1000);
  };

  if (isSubscribed) {
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
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>
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