import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Plus, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Submission {
  id: string;
  title: string;
  summary: string;
  category: string;
  department: string;
  semester: number | null;
  media_url: string | null;
  external_link: string | null;
  submitter_name: string;
  pinned: boolean;
  created_at: string;
}

const Students = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      case 'talent':
        return <Star className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      case 'talent':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'competition':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student submissions...</p>
        </div>
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
              Students' Showcase
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Celebrating the achievements, talents, and projects of our amazing students
            </p>
            <Link to="/submit">
              <Button size="lg" className="font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Share Your Achievement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Submissions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {submissions.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No submissions yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Be the first to share your achievement, talent, or project with the community!
              </p>
              <Link to="/submit">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your Work
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission) => (
                <Card key={submission.id} className="h-full flex flex-col">
                  {submission.media_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={submission.media_url}
                        alt={submission.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="flex-none">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getCategoryColor(submission.category)}>
                            {getCategoryIcon(submission.category)}
                            <span className="ml-1">{submission.category}</span>
                          </Badge>
                          {submission.pinned && (
                            <Badge variant="secondary">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {submission.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {submission.summary}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>by {submission.submitter_name}</span>
                        <span>•</span>
                        <span>{submission.department}</span>
                        {submission.semester && (
                          <>
                            <span>•</span>
                            <span>Sem {submission.semester}</span>
                          </>
                        )}
                      </div>
                      
                      {submission.external_link && (
                        <a
                          href={submission.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline text-sm"
                        >
                          View Project
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Students;