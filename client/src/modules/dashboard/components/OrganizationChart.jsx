import { useEffect, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllEmployees } from "@/modules/hr/api/employeeApi";
import { getAllOrganizations } from "@/modules/admin/organizations/api/organizationApi";
import { Loader2, Building } from "lucide-react";

export default function OrganizationChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [empResponse, orgResponse] = await Promise.all([
          getAllEmployees({ limit: 1000 }),
          getAllOrganizations(),
        ]);

        const employees = empResponse.data || [];
        const organizations = Array.isArray(orgResponse) ? orgResponse : [];

        const orgMap = {};
        organizations.forEach(org => {
            // Use organization_code as the key/label
            orgMap[org._id] = org.organization_code || org.organization_name; 
        });

        const orgCounts = {};
        employees.forEach((emp) => {
          const tenantId = emp.tenantId;
          const orgLabel = orgMap[tenantId] || "Digər";
          orgCounts[orgLabel] = (orgCounts[orgLabel] || 0) + 1;
        });

        organizations.forEach(org => {
            const label = org.organization_code || org.organization_name;
            if (!orgCounts[label]) {
                orgCounts[label] = 0;
            }
        });

        const chartData = Object.keys(orgCounts).map((key) => ({
          organization: key,
          count: orgCounts[key],
        }));

        // Sort by count desc for better visualization in radar (usually)
        chartData.sort((a, b) => b.count - a.count);
        setData(chartData.slice(0, 8)); // Limit to top 8 for radar readability
      } catch (error) {
        console.error("Failed to fetch organization stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-none rounded-xl bg-white">
      <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
           <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Qurum Statistikası
              </CardTitle>
              <CardDescription className="text-xs">
                Əməkdaşların qurumlara görə paylanması
              </CardDescription>
           </div>
           <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
             <Building className="h-4 w-4 text-gray-500" />
           </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Məlumat yoxdur
          </div>
        ) : (
          <ResponsiveRadar
            data={data}
            keys={[ 'count' ]}
            indexBy="organization"
            valueFormat=">-.0f"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            borderColor={{ from: 'color' }}
            gridLabelOffset={36}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors={['#124459']}
            blendMode="multiply"
            motionConfig="wobbly"
            fillOpacity={0.25}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 12,
                    fill: "#64748b",
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#e2e8f0",
                  strokeDasharray: "4 4",
                },
              },
              tooltip: {
                container: {
                  background: "#ffffff",
                  color: "#1e293b",
                  fontSize: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "8px 12px",
                },
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
