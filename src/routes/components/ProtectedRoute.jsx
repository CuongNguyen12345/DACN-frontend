import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isLoggedIn, role, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để truy cập trang này!");
    }
  }, [isLoggedIn, role, allowedRoles, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;