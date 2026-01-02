import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { ROUTE_PATHS } from "@/consts/routes";
import HeaderArea from "./components/HeaderArea";

export default function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  return (
    <div className="min-h-dvh bg-[#124559]">
      <HeaderArea />
      <main className="p-6 bg-[#fff] mx-6 rounded-[30px] ">
        <Outlet />
      </main>
    </div>
  );
}
