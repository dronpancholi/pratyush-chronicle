import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendingNewsletters = () => {
  const { data: trending, isLoading } = useQuery({
    queryKey: ['trending-newsletters'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get newsletters from the past 30 days
      const { data: newsletters, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('is_published', true)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get reaction counts for these newsletters
      const newsletterIds = newsletters?.map(n => n.id) || [];
      const { data: reactions } = await supabase
        .from('reactions')
        .select('entity_id, reaction')
        .eq('entity_type', 'newsletter')
        .in('entity_id', newsletterIds);

      // Calculate like counts and sort by likes
      const newslettersWithLikes = (newsletters || []).map(newsletter => {
        const likes = reactions?.filter(r => r.entity_id === newsletter.id && r.reaction === 'like').length || 0;
        return { ...newsletter, likeCount: likes };
      });

      return newslettersWithLikes
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 3);
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Trending Newsletters
            </h2>
            <p className="text-muted-foreground">Most liked newsletters from the past 30 days</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
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

  if (!trending?.length) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 mr-2" />
            Trending Newsletters
          </h2>
          <p className="text-muted-foreground">Most liked newsletters from the past 30 days</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map((newsletter, index) => (
            <Link key={newsletter.id} to={`/current-issue?id=${newsletter.id}`}>
              <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer relative">
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                    #1 Trending
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(newsletter.issue_date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-sm font-medium">
                      ❤️ {newsletter.likeCount} likes
                    </div>
                  </div>
                  {newsletter.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {newsletter.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNewsletters;