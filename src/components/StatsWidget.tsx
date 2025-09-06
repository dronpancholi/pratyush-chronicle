import { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalNewsletters: number;
  totalSubmissions: number;
  thisMonthSubmissions: number;
  averageRating: number;
}

const StatsWidget = () => {
  const [stats, setStats] = useState<Stats>({
    totalNewsletters: 0,
    totalSubmissions: 0,
    thisMonthSubmissions: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total newsletters
      const { count: newsletterCount } = await supabase
        .from('newsletters')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get total submissions
      const { count: submissionCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get this month's submissions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gte('created_at', startOfMonth.toISOString());

      // Get average rating
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('rating');

      const avgRating = feedbackData && feedbackData.length > 0
        ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length
        : 0;

      setStats({
        totalNewsletters: newsletterCount || 0,
        totalSubmissions: submissionCount || 0,
        thisMonthSubmissions: monthlyCount || 0,
        averageRating: Number(avgRating.toFixed(1))
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      title: 'Total Newsletters',
      value: stats.totalNewsletters,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Approved Submissions',
      value: stats.totalSubmissions,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'This Month',
      value: stats.thisMonthSubmissions,
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      title: 'Avg Rating',
      value: stats.averageRating,
      icon: Users,
      color: 'text-purple-600',
      suffix: '/5'
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Club Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-muted/30">
              <item.icon className={`h-5 w-5 mx-auto mb-2 ${item.color}`} />
              <div className="text-lg font-bold">
                {item.value}{item.suffix || ''}
              </div>
              <div className="text-xs text-muted-foreground">{item.title}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsWidget;