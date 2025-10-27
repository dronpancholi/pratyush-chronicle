import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'editor' | 'contributor' | 'president' | 'viewer';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.role as UserRole | null;
    },
    enabled: !!user?.id,
  });

  const hasRole = (checkRole: UserRole | UserRole[]) => {
    if (!role) return false;
    if (Array.isArray(checkRole)) {
      return checkRole.includes(role);
    }
    return role === checkRole;
  };

  const isAdmin = role === 'admin';
  const isEditor = role === 'editor' || isAdmin;
  const isContributor = role === 'contributor' || isEditor;
  const isPresident = role === 'president';

  return {
    role,
    isLoading,
    hasRole,
    isAdmin,
    isEditor,
    isContributor,
    isPresident,
  };
};
