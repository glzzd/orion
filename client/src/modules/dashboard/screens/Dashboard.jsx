import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/consts/permissions";
import { formatDate } from "@/lib/utils";
import AdminStats from "../components/AdminStats";
import HrStats from "../components/HrStats";
import DepartmentChart from "../components/DepartmentChart";
import OrganizationChart from "../components/OrganizationChart";

export default function Dashboard() {
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);
  
  // Check for SUPER_ADMIN role
  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || 
                       user?.roles?.some(r => r.name === "SUPER_ADMIN" || (r.roleId && r.roleId.name === "SUPER_ADMIN"));

  const canReadHr = perms.has(PERMISSIONS.HR.READ) || isSuperAdmin;

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Məlumat lövhəsi</h2>
        
          <p className="text-muted-foreground mt-1">Xoş gəlmişsiniz, <span className="font-bold">{user?.lastName} {user?.firstName}</span>!</p>
          {/* <p className="text-muted-foreground mt-1">Bu bölmədə sistem də olan bütün məlumatlar haqqında qısa statistikalar görə bilərsiniz.</p> */}
        </div>
        <div className="hidden md:flex items-center gap-2">
           <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
              {formatDate(new Date())}
           </span>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="space-y-8">
          <AdminStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <OrganizationChart />
            </div>
            <div className="lg:col-span-1">
               {/* Always show HR stats if Super Admin, maybe in a better layout or just here */}
               <HrStats />
            </div>
          </div>
        </div>
      )}
      
      {!isSuperAdmin && canReadHr && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <DepartmentChart />
            </div>
            <div className="lg:col-span-1">
              <HrStats />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

