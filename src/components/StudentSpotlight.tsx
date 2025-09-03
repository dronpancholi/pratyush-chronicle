import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentSpotlight = () => {
  const { data: spotlightSubmissions, isLoading } = useQuery({
    queryKey: ['student-spotlight'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .eq('pinned', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
              <Star className="h-6 w-6 mr-2" />
              Student Spotlight
            </h2>
            <p className="text-muted-foreground">Featuring outstanding student achievements</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!spotlightSubmissions?.length) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
            <Star className="h-6 w-6 mr-2" />
            Student Spotlight
          </h2>
          <p className="text-muted-foreground">Featuring outstanding student achievements</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spotlightSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:scale-105 transition-transform duration-200 relative">
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                ⭐ Spotlight
              </div>
              
              {submission.media_url && (
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={submission.media_url} 
                    alt={submission.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg pr-4">{submission.title}</CardTitle>
                  {submission.external_link && (
                    <a 
                      href={submission.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {submission.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {submission.department}
                  </span>
                  {submission.semester && (
                    <span className="text-sm text-muted-foreground">
                      • Sem {submission.semester}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {submission.summary}
                </p>
                <div className="text-xs text-muted-foreground">
                  By {submission.submitter_name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/students" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            View all student achievements →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudentSpotlight;