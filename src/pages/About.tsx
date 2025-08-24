import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Users, Award, Target, Heart, ExternalLink } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <Heart className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              About Pratyush Chronicle
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Learn about our mission, the people behind the newsletter, and how we serve 
              the Government Polytechnic Ahmedabad community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <Card className="academic-card text-center">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To showcase the achievements, innovations, and academic excellence of 
                    all departments within Government Polytechnic Ahmedabad through 
                    comprehensive monthly publications.
                  </p>
                </CardContent>
              </Card>

              <Card className="academic-card text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Our Community</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Serving 16 diverse departments, we bring together engineering, 
                    technology, science, and administrative achievements under one 
                    unified publication platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="academic-card text-center">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Our Vision</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To become the premier source of academic and technical updates, 
                    fostering knowledge sharing and celebrating the spirit of innovation 
                    within our institution.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* About the Platform */}
            <Card className="academic-card mb-16">
              <CardHeader>
                <CardTitle className="text-2xl text-center">About the Platform</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-base leading-relaxed">
                    Pratyush Chronicle represents a modern approach to academic communication, 
                    bringing together the rich diversity of Government Polytechnic Ahmedabad 
                    under a single, comprehensive newsletter platform. Our monthly publications 
                    serve as a bridge between departments, showcasing achievements, innovations, 
                    and the vibrant academic life of our institution.
                  </p>
                  
                  <p className="text-base leading-relaxed">
                    Each issue features dedicated sections for all 16 departments, including 
                    engineering disciplines, technology programs, science education, and 
                    administrative operations. From research breakthroughs and project showcases 
                    to cultural events and student achievements, we capture the complete spectrum 
                    of institutional excellence.
                  </p>

                  <p className="text-base leading-relaxed">
                    Our platform combines traditional newsletter values with modern digital 
                    accessibility, offering both online reading and downloadable PDF formats. 
                    The searchable archive ensures that important announcements, achievements, 
                    and milestones remain accessible to current and future members of our community.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credits Section - Critical Requirement */}
            <Card className="academic-card mb-16 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">Credits & Attribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="bg-primary/5 rounded-lg p-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Project Leadership & Development
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-card border border-border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary mb-2">Dron Pancholi</h4>
                        <div className="space-y-1">
                          <Badge variant="default" className="mr-2 mb-2">Concept & Direction</Badge>
                          <Badge variant="default" className="mr-2 mb-2">Design & Development</Badge>
                          <Badge variant="default" className="mr-2 mb-2">Editorial Leadership</Badge>
                          <Badge variant="default" className="mr-2 mb-2">Technical Implementation</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          Complete conceptualization, planning, design, development, and editorial oversight 
                          of the Pratyush Chronicle platform and publication system.
                        </p>
                      </div>
                      
                      <div className="bg-card border border-border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-foreground mb-2">Alaukik Dave</h4>
                        <Badge variant="outline" className="mb-2">Club President</Badge>
                        <p className="text-sm text-muted-foreground mt-3">
                          Official Club President, providing institutional support and leadership 
                          for the Pratyush Club newsletter initiative.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    This platform represents the complete vision and execution of Dron Pancholi, 
                    from initial concept through technical implementation, supported by the 
                    institutional leadership of Club President Alaukik Dave.
                  </p>
                </div>
              </CardContent>
            </Card>

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
                            href="https://gpa.ac.in" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-hover text-sm transition-colors"
                          >
                            gpa.ac.in
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;