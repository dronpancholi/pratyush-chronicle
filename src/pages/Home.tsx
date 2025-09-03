import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Users, Archive, Calendar, BookOpen } from 'lucide-react';
import heroImage from '@/assets/hero-newsletter.jpg';
import DepartmentsHorizontal from '@/components/DepartmentsHorizontal';
import NewsletterHighlights from '@/components/NewsletterHighlights';
import EmailSubscription from '@/components/EmailSubscription';
import NoticeBoard from '@/components/NoticeBoard';
import TrendingNewsletters from '@/components/TrendingNewsletters';
import StudentSpotlight from '@/components/StudentSpotlight';

const Home = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const features = [
    {
      icon: FileText,
      title: 'Monthly Issues',
      description: 'Regular monthly publications featuring content from all departments'
    },
    {
      icon: Users,
      title: '15 Departments',
      description: 'Comprehensive coverage from all engineering and academic departments'
    },
    {
      icon: Archive,
      title: 'Complete Archive',
      description: 'Access to all previous issues organized by year and month'
    },
    {
      icon: BookOpen,
      title: 'Rich Content',
      description: 'Articles, achievements, announcements, and department highlights'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Government Polytechnic Ahmedabad Newsletter" 
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Pratyush Newsletter
            </h1>
            <p className="text-xl sm:text-2xl mb-4 opacity-90">
              Student Newsletter of Government Polytechnic Ahmedabad
            </p>
            <p className="text-lg mb-4 opacity-80 max-w-2xl mx-auto">
              Discover the latest achievements, innovations, and updates from all departments 
              of our prestigious institution. Stay connected with the academic and technical excellence 
              that defines our community.
            </p>
            <p className="text-sm mb-8 opacity-70 italic max-w-xl mx-auto">
              <strong>Note:</strong> The Pratyush Newsletter is not the official newsletter of Government Polytechnic Ahmedabad. 
              It is a student-led initiative created by and for the students of GPA.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link to="/current-issue">
                  <FileText className="h-5 w-5 mr-2" />
                  Read Current Issue
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/departments">
                  <Users className="h-5 w-5 mr-2" />
                  Explore Departments
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Highlights */}
      <NewsletterHighlights />

      {/* Trending Newsletters */}
      <TrendingNewsletters />

      {/* Student Spotlight */}
      <StudentSpotlight />

      {/* Notice Board */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NoticeBoard limit={3} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Pratyush Newsletter?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive source for all academic and technical updates from Government Polytechnic Ahmedabad
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const getLink = () => {
                switch (feature.title) {
                  case 'Monthly Issues':
                    return '/current-issue';
                  case '15 Departments':
                    return '/departments';
                  case 'Complete Archive':
                    return '/archive';
                  case 'Rich Content':
                    return '/students';
                  default:
                    return '/';
                }
              };
              
              return (
                <Link key={index} to={getLink()}>
                  <Card className="academic-card text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Departments Horizontal Display */}
      <DepartmentsHorizontal />

      {/* Email Subscription */}
      <EmailSubscription />

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore Archive</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the rich history of achievements and innovations at Government Polytechnic Ahmedabad 
              through our comprehensive newsletter archive.
            </p>
            <Button asChild size="lg">
              <Link to="/archive">
                <Archive className="h-5 w-5 mr-2" />
                Browse Complete Archive
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;