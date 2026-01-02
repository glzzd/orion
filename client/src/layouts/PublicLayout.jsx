import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { ROUTE_PATHS } from "@/consts/routes";

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  return (
    <div className="min-h-dvh overflow-hidden">
      <Outlet />
    </div>
  );
}
