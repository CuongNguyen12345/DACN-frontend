import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để truy cập trang này!");
    }
  }, [isLoggedIn]);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;