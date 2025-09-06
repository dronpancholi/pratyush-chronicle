import { useState, useEffect } from 'react';
import { Clock, FileText, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  type: 'submission' | 'newsletter' | 'feedback';
  title: string;
  time: string;
  status?: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const promises = [];

      // Get recent submissions
      promises.push(
        supabase
          .from('submissions')
          .select('id, title, created_at, status')
          .order('created_at', { ascending: false })
          .limit(3)
      );

      // Get recent newsletters
      promises.push(
        supabase
          .from('newsletters')
          .select('id, title, created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3)
      );

      // Get recent feedback
      promises.push(
        supabase
          .from('feedback')
          .select('id, rating, created_at')
          .order('created_at', { ascending: false })
          .limit(2)
      );

      const [submissionsRes, newslettersRes, feedbackRes] = await Promise.all(promises);

      const allActivities: ActivityItem[] = [];

      // Add submissions
      if (submissionsRes.data) {
        submissionsRes.data.forEach(item => {
          allActivities.push({
            id: item.id,
            type: 'submission',
            title: item.title,
            time: item.created_at,
            status: item.status
          });
        });
      }

      // Add newsletters
      if (newslettersRes.data) {
        newslettersRes.data.forEach(item => {
          allActivities.push({
            id: item.id,
            type: 'newsletter',
            title: item.title,
            time: item.created_at
          });
        });
      }

      // Add feedback
      if (feedbackRes.data) {
        feedbackRes.data.forEach(item => {
          allActivities.push({
            id: item.id,
            type: 'feedback',
            title: `${item.rating} star rating`,
            time: item.created_at
          });
        });
      }

      // Sort by time and take the most recent 5
      allActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivities(allActivities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return FileText;
      case 'newsletter': return FileText;
      case 'feedback': return Star;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission': return 'text-blue-600';
      case 'newsletter': return 'text-green-600';
      case 'feedback': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {activities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const color = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-muted/50 ${color}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.time)}
                      </p>
                      {activity.status && (
                        <Badge 
                          variant={activity.status === 'approved' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;