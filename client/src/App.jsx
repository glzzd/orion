import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext.jsx";
import PublicLayout from "@/layouts/PublicLayout.jsx";
import PrivateLayout from "@/layouts/PrivateLayout.jsx";
import Login from "@/modules/auth/screens/Login.jsx";
import ForgotPassword from "@/modules/auth/screens/ForgotPassword.jsx";
import ResetPassword from "@/modules/auth/screens/ResetPassword.jsx";
import Dashboard from "@/modules/dashboard/screens/Dashboard.jsx";
import Employees from "@/modules/hr/screens/Employees/Employees.jsx";
import NewEmployee from "@/modules/hr/screens/Employees/NewEmployee.jsx";
import NotFound from "@/modules/common/screens/NotFound.jsx";
import { ROUTE_PATHS } from "@/consts/routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}> 
            <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
            <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPassword />} />
          </Route>

          <Route element={<PrivateLayout />}> 
            <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />
            <Route path="/human-resources/employees" element={<Employees />} />
            <Route path="/human-resources/employees/new" element={<NewEmployee />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
