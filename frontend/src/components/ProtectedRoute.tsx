import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
        <p className="text-sm text-muted-foreground">Contact the administrator to get access.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
