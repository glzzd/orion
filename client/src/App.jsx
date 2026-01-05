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
import AllUsersPage from "@/modules/admin/users/screens/AllUsersPage.jsx";
import AddNewUserPage from "@/modules/admin/users/screens/AddNewUserPage.jsx";
import EditUserPage from "@/modules/admin/users/screens/EditUserPage.jsx";
import AddNewOrganizations from "@/modules/admin/organizations/screens/AddNewOrganizationsPage.jsx";
import AllOrganizationsPage from "@/modules/admin/organizations/screens/AllOrganizationsPage.jsx";
import OrganizationDetailsPage from "@/modules/admin/organizations/screens/OrganizationDetailsPage.jsx";
import OrganizationStructurePage from "@/modules/admin/organizations/screens/OrganizationStructurePage.jsx";
import OrganizationStructuresPage from "@/modules/admin/organizations/screens/OrganizationStructuresPage.jsx";
import NotFound from "@/modules/common/screens/NotFound.jsx";
import { ROUTE_PATHS } from "@/consts/routes";
import { PERMISSIONS } from "@/consts/permissions";
import PermissionGuard from "@/components/PermissionGuard";

import { Toaster } from "@/components/ui/sonner";
import AllRoles from "@/modules/admin/roles/screens/AllRoles.jsx";
import AddNewRole from "@/modules/admin/roles/screens/AddNewRole.jsx";
import DynamicTitle from "./components/DynamicTitle";
import UploadCategoriesPage from "./modules/purchase/categories/screens/UploadCategoriesPage";
import AllCategoriesPage from "./modules/purchase/categories/screens/AllCategoriesPage";
import AddNewCategoryPage from "./modules/purchase/categories/screens/AddNewCategoryPage";
import AddNewProductPage from "./modules/purchase/categories/screens/AddNewProductPage";

function App() {
  return (
    <BrowserRouter>
      <DynamicTitle />
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route element={<PublicLayout />}> 
            <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
            <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPassword />} />
          </Route>

          <Route element={<PrivateLayout />}> 
            <Route path={ROUTE_PATHS.DASHBOARD} element={
              <PermissionGuard requiredPermission={PERMISSIONS.DASHBOARD.READ}>
                <Dashboard />
              </PermissionGuard>
            } />
            <Route path="/human-resources/employees" element={
              <PermissionGuard requiredPermission={PERMISSIONS.HR.READ}>
                <Employees />
              </PermissionGuard>
            } />
            <Route path="/human-resources/employees/new" element={
              <PermissionGuard requiredPermission={PERMISSIONS.HR.CREATE}>
                <NewEmployee />
              </PermissionGuard>
            } />
            <Route path="/admin/users" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.USERS}>
                <AllUsersPage />
              </PermissionGuard>
            } />
            <Route path="/admin/users/add" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.USERS}>
                <AddNewUserPage />
              </PermissionGuard>
            } />
            <Route path="/admin/users/edit/:id" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.USERS}>
                <EditUserPage />
              </PermissionGuard>
            } />
            <Route path="/admin/organizations" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ORGANIZATIONS}>
                <AllOrganizationsPage />
              </PermissionGuard>
            } />
            <Route path="/admin/organizations/add" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ORGANIZATIONS}>
                <AddNewOrganizations />
              </PermissionGuard>
            } />
            <Route path="/admin/organizations/:id" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ORGANIZATIONS}>
                <OrganizationDetailsPage />
              </PermissionGuard>
            } />
            <Route path="/admin/organizations/:id/structure" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ORGANIZATIONS}>
                <OrganizationStructurePage />
              </PermissionGuard>
            } />
            <Route path="/admin/organizations/structures" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ORGANIZATIONS}>
                <OrganizationStructuresPage />
              </PermissionGuard>
            } />
            <Route path="/admin/roles" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ROLES}>
                <AllRoles />
              </PermissionGuard>
            } />
            <Route path="/admin/roles/add" element={
              <PermissionGuard requiredPermission={PERMISSIONS.ADMIN.ROLES}>
                <AddNewRole />
              </PermissionGuard>
            } />
            <Route path="/purchase/categories/upload" element={
              <PermissionGuard requiredPermission={PERMISSIONS.PURCHASE.CATEGORIES}>
                <UploadCategoriesPage />
              </PermissionGuard>
            } />
            <Route path="/purchase/categories" element={
              <PermissionGuard requiredPermission={PERMISSIONS.PURCHASE.CATEGORIES}>
                <AllCategoriesPage />
              </PermissionGuard>
            } />
            <Route path="/purchase/products/new" element={
              <PermissionGuard requiredPermission={PERMISSIONS.PURCHASE.CATEGORIES}>
                <AddNewProductPage />
              </PermissionGuard>
            } />
            <Route path="/purchase/categories/new" element={
              <PermissionGuard requiredPermission={PERMISSIONS.PURCHASE.CATEGORIES}>
                <AddNewCategoryPage />
              </PermissionGuard>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
