import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isFirebaseReady } from '@/lib/firebase/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Allow access if Firebase is not configured (for local testing)
  const allowWithoutAuth = !isFirebaseReady;

  if (loading && isFirebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!allowWithoutAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

