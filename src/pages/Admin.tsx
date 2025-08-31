import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';
import { departments } from '@/data/departments';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile || !['admin', 'editor', 'president', 'contributor'].includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <Dashboard departments={departments} />;
};

export default Admin;