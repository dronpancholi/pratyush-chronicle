import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReactionsProps {
  entityType: string;
  entityId: string;
  className?: string;
}

const Reactions = ({ entityType, entityId, className = '' }: ReactionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likeCount, setLikeCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReactions();
    if (user) {
      fetchUserReaction();
    }
  }, [entityType, entityId, user]);

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_like_count', {
        p_entity_type: entityType,
        p_entity_id: entityId
      });

      if (error) throw error;
      setLikeCount(typeof data === 'number' ? data : 0);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const fetchUserReaction = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('reaction')
        .eq('user_id', user.id)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserReaction((data?.reaction as 'like' | 'dislike') || null);
    } catch (error) {
      console.error('Error fetching user reaction:', error);
    }
  };

  const handleReaction = async (newReaction: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Optimistic update
      const wasLike = userReaction === 'like';
      const isTogglingSame = userReaction === newReaction;
      
      if (isTogglingSame) {
        // Remove reaction
        setUserReaction(null);
        if (newReaction === 'like') {
          setLikeCount(prev => Math.max(0, prev - 1));
        }
        
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('entity_type', entityType)
          .eq('entity_id', entityId);

        if (error) throw error;
      } else {
        // Add or update reaction
        const oldReaction = userReaction;
        setUserReaction(newReaction);
        
        if (newReaction === 'like') {
          setLikeCount(prev => prev + 1);
        } else if (wasLike) {
          setLikeCount(prev => Math.max(0, prev - 1));
        }

        const { error } = await supabase
          .from('reactions')
          .upsert({
            user_id: user.id,
            entity_type: entityType,
            entity_id: entityId,
            reaction: newReaction
          });

        if (error) throw error;
      }
    } catch (error: any) {
      // Revert optimistic update
      fetchReactions();
      fetchUserReaction();
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('like')}
        disabled={loading}
        className={`flex items-center space-x-1 ${
          userReaction === 'like' ? 'text-blue-600 bg-blue-50' : ''
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likeCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        className={`flex items-center space-x-1 ${
          userReaction === 'dislike' ? 'text-red-600 bg-red-50' : ''
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Reactions;