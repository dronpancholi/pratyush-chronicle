import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Pin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notice {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  pinned: boolean;
  published_at: string;
  expires_at: string | null;
  created_at: string;
}

interface NoticeBoardProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const NoticeBoard = ({ limit, showHeader = true, className = '' }: NoticeBoardProps) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, [limit]);

  const fetchNotices = async () => {
    try {
      let query = supabase
        .from('notice_board')
        .select('*')
        .lte('published_at', new Date().toISOString())
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Notice Board</h2>
          </div>
        )}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Notice Board</h2>
          </div>
        )}
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Pin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active notices at the moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Notice Board</h2>
          {limit && notices.length >= limit && (
            <Link to="/notices">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className={notice.pinned ? 'border-primary' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {notice.pinned && (
                      <Badge className="bg-primary/10 text-primary border-primary">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(notice.published_at)}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {notice.body}
              </p>
              
              {notice.link_url && (
                <a
                  href={notice.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Read More
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;