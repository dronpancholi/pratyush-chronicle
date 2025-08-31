import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, ExternalLink } from 'lucide-react';
import pratyushLogo from '@/assets/pratyush-logo.png';

const About = () => {
  return (
    <>
      {/* Meta tag for subtle attribution */}
      <meta name="author" content="Dron Pancholi" />
      
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-secondary border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src={pratyushLogo} 
                  alt="Pratyush Club Logo - Government Polytechnic Ahmedabad" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                About the Pratyush Newsletter
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Learn about our newsletter, its development, and how it serves 
                the Government Polytechnic Ahmedabad community.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              
              {/* Primary About Content */}
              <Card className="academic-card mb-16">
                <CardContent className="prose prose-gray max-w-none p-8">
                  <div className="space-y-6 text-muted-foreground">
                    <p className="text-lg leading-relaxed text-foreground">
                      The Pratyush Newsletter began as a simple idea and has now evolved into a fully developed 
                      website that keeps us updated with the latest news, events, and activities from all 
                      departments of Government Polytechnic Ahmedabad.
                    </p>
                    
                    <p className="text-lg leading-relaxed text-foreground">
                      The design, development, and implementation of the site have been carried out by 
                      <span className="font-medium text-primary"> Dron Pancholi</span>, under the guidance and 
                      supervision of <span className="font-medium text-primary">Alaukik Dave</span>, the founder 
                      of the Pratyush Club.
                    </p>
                    
                    <p className="text-lg leading-relaxed text-foreground">
                      This initiative ensures that students and faculty alike can stay informed and connected 
                      with the vibrant happenings across the campus.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="academic-card mb-16 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
                <CardContent className="p-6">
                  <p className="text-center text-foreground font-medium">
                    <strong>Important Notice:</strong> This is not the official newsletter of Government Polytechnic Ahmedabad. 
                    It is created by students, for the students.
                  </p>
                </CardContent>
              </Card>

              {/* Logo Section */}
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className="bg-secondary/50 rounded-lg p-8">
                    <img 
                      src={pratyushLogo} 
                      alt="Official Pratyush Club Logo" 
                      className="h-32 w-32 object-contain mx-auto"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Official Pratyush Club Logo
                </p>
              </div>

              {/* Contact Information */}
              <Card className="academic-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-4">Institution Details</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Government Polytechnic Ahmedabad</p>
                            <p className="text-muted-foreground text-sm">
                              Ambawadi, Ahmedabad<br />
                              Gujarat, India
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">Newsletter Contact</p>
                            <a 
                              href="mailto:pratyushclub@gpa.ac.in" 
                              className="text-primary hover:text-primary-hover text-sm transition-colors"
                            >
                              pratyushclub@gpa.ac.in
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <ExternalLink className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">Official Website</p>
                            <a 
                              href="https://www.gpahmedabad.ac.in" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-hover text-sm transition-colors"
                            >
                              www.gpahmedabad.ac.in
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-4">Newsletter Information</h4>
                      <div className="space-y-4">
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <h5 className="font-medium text-foreground mb-2">Publication Schedule</h5>
                          <p className="text-muted-foreground text-sm">
                            Monthly publication on the 15th of each month
                          </p>
                        </div>
                        
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <h5 className="font-medium text-foreground mb-2">Submission Guidelines</h5>
                          <p className="text-muted-foreground text-sm">
                            Department content submissions due by the 10th of each month
                          </p>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-4">
                          <h5 className="font-medium text-foreground mb-2">Archive Access</h5>
                          <p className="text-muted-foreground text-sm">
                            All issues freely available in our comprehensive archive
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border text-center">
                    <Button asChild>
                      <a href="mailto:pratyushclub@gpa.ac.in">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Us
                      </a>
                    </Button>
                    <Button variant="outline" asChild className="ml-4">
                      <a href="/credits">
                        View Credits
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subtle watermark for attribution */}
              <div className="mt-16 text-center">
                <p className="text-xs text-muted-foreground/50" style={{ 
                  letterSpacing: '0.2em', 
                  fontWeight: '300',
                  filter: 'opacity(0.3)'
                }}>
                  — ∂ρ —
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;