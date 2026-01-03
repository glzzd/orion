import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function PermissionGuard({ requiredPermission, children }) {
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);

  // If no permission is required, allow access
  if (!requiredPermission) return children;

  // Check if user has the required permission
  if (!perms.has(requiredPermission)) {
    // If user is logged in but doesn't have permission, redirect to dashboard or 403
    // For now, redirect to dashboard (/) if they are not already there
    // If they are on dashboard and don't have access, maybe show empty state? 
    // But usually everyone has dashboard access.
    return <Navigate to="/" replace />;
  }

  return children;
}
