import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const AnnouncementBar = () => {
  const { data: notices } = useQuery({
    queryKey: ['recent-notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notice_board')
        .select('*')
        .lte('published_at', new Date().toISOString())
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
  });

  if (!notices?.length) return null;

  return (
    <div className="bg-primary/10 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="flex animate-[scroll_30s_linear_infinite] space-x-8 py-2">
            {notices.concat(notices).map((notice, index) => (
              <div key={`${notice.id}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="text-sm font-medium text-foreground">
                  📢 {notice.title}
                </span>
                {notice.link_url && (
                  <a 
                    href={notice.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;