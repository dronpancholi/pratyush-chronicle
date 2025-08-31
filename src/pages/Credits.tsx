import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Code, Lightbulb, User, Crown, Award } from 'lucide-react';
import pratyushLogo from '@/assets/pratyush-logo.png';

const Credits = () => {
  return (
    <>
      {/* Hidden attribution in metadata */}
      <meta name="author" content="Dron Pancholi" />
      <meta name="creator" content="Dron Pancholi" />
      <meta name="developer" content="Dron Pancholi" />
      
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary to-primary/5 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <img 
                  src={pratyushLogo} 
                  alt="Pratyush Club Logo" 
                  className="h-24 w-24 object-contain"
                />
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Credits & Attribution
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Recognizing the individuals who brought the Pratyush Newsletter to life
              </p>
            </div>
          </div>
        </section>

        {/* Main Attribution Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              
              {/* Primary Creator - Dron Pancholi */}
              <Card className="mb-12 border-2 border-primary/20 shadow-lg">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 rounded-full p-4">
                      <Code className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Dron Pancholi
                  </CardTitle>
                  <p className="text-lg text-primary font-semibold">Primary Creator & Developer</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                      Complete conceptualization, design, development, and execution of the Pratyush Newsletter platform. 
                      From initial idea to full implementation, every aspect of this project has been crafted with dedication and precision.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="bg-secondary/50 rounded-lg p-6 mb-4">
                        <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground">Concept & Vision</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Original idea and strategic planning</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-secondary/50 rounded-lg p-6 mb-4">
                        <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground">Design & UX</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">User interface and experience design</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-secondary/50 rounded-lg p-6 mb-4">
                        <Code className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground">Development</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Full-stack implementation</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-secondary/50 rounded-lg p-6 mb-4">
                        <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground">Execution</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Project management and delivery</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                    <h5 className="font-semibold text-foreground mb-3">Technical Contributions:</h5>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• React + TypeScript frontend development</li>
                      <li>• Supabase backend integration with authentication</li>
                      <li>• Responsive design implementation</li>
                      <li>• Database schema design and optimization</li>
                      <li>• PDF handling and storage solutions</li>
                      <li>• Role-based access control system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Club President - Alaukik Dave */}
              <Card className="mb-12 border border-secondary shadow-md">
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-4">
                      <Crown className="h-10 w-10 text-amber-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Alaukik Dave
                  </CardTitle>
                  <p className="text-lg text-amber-600 font-semibold">Club President & Founder</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
                      Founder of the Pratyush Club and visionary leader who provided guidance, 
                      supervision, and strategic direction throughout the project development.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 mb-4">
                        <Crown className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground">Leadership</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Pratyush Club founder and president</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 mb-4">
                        <User className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground">Supervision</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Project guidance and oversight</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Information */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-4">Technology Stack</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Frontend: React, TypeScript, Tailwind CSS</p>
                        <p>• Backend: Supabase (PostgreSQL, Auth, Storage)</p>
                        <p>• UI Components: Shadcn/ui, Radix UI</p>
                        <p>• Icons: Lucide React</p>
                        <p>• Build Tool: Vite</p>
                        <p>• Deployment: Lovable Platform</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-4">Features</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Responsive design for all devices</p>
                        <p>• PDF viewing and download capabilities</p>
                        <p>• Department-wise content organization</p>
                        <p>• Archive system for past issues</p>
                        <p>• Authentication and user management</p>
                        <p>• File upload and storage system</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Easter Egg Section */}
              <div className="text-center py-12">
                <div 
                  className="inline-block cursor-pointer transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    const message = "🎨 Crafted entirely by Dron Pancholi with passion and precision 🚀\n\nFrom concept to code, every pixel tells a story of dedication.";
                    alert(message);
                  }}
                  title="Click to reveal creator signature"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full p-4 inline-block">
                    <div className="text-2xl font-mono tracking-widest text-primary/70 hover:text-primary transition-colors">
                      ∂ρ
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/50 mt-2 italic">
                  Click the signature above
                </p>
              </div>

              {/* Acknowledgments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center">Acknowledgments</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Special thanks to the faculty and students of Government Polytechnic Ahmedabad 
                    for their support and enthusiasm for this initiative.
                  </p>
                  <p className="text-muted-foreground">
                    This platform serves as a bridge connecting all departments and fostering 
                    a sense of community within our institution.
                  </p>
                  <div className="pt-6">
                    <Button asChild>
                      <a href="mailto:pratyushclub@gpa.ac.in">
                        Contact the Development Team
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Credits;