import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để truy cập trang này!");
      return;
    }

    /* if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      toast.error("Bạn không có quyền truy cập trang này!");
    } */
  }, [isLoggedIn, role, allowedRoles]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;