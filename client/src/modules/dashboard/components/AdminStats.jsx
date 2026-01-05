import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllOrganizations } from "@/modules/admin/organizations/api/organizationApi";
import { getAllUsers } from "@/modules/admin/users/api/userApi";
import { getAllEmployees } from "@/modules/hr/api/employeeApi";
import { Building2, Users, Briefcase, TrendingUp } from "lucide-react";

export default function AdminStats() {
  const [stats, setStats] = useState({
    orgs: 0,
    users: 0,
    employees: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [orgsData, usersData, employeesData] = await Promise.all([
          getAllOrganizations(),
          getAllUsers({ limit: 1 }),
          getAllEmployees({ limit: 1 }),
        ]);

        setStats({
          orgs: Array.isArray(orgsData) ? orgsData.length : 0,
          users: usersData.meta?.total || 0,
          employees: employeesData.meta?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    }
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <Card className="overflow-hidden border-none shadow-sm rounded-xl bg-white hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass}`}>
              <Icon className={`h-6 w-6 ${colorClass}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
          </div>
          <div className="flex flex-col items-end">
             {/* Decorative circle or trend indicator */}
             <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full text-emerald-700 text-xs font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard 
        title="Ümumi Qurum" 
        value={stats.orgs} 
        icon={Building2} 
        colorClass="text-[#124459]"
        bgClass="bg-[#e8f1f3]"
      />
      <StatCard 
        title="Ümumi İşçi" 
        value={stats.employees} 
        icon={Briefcase} 
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
      <StatCard 
        title="Ümumi İstifadəçi" 
        value={stats.users} 
        icon={Users} 
        colorClass="text-violet-600"
        bgClass="bg-violet-50"
      />
    </div>
  );
}
