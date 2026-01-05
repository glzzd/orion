import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllEmployees } from "@/modules/hr/api/employeeApi";
import { Loader2, BarChart3 } from "lucide-react";

export default function DepartmentChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllEmployees({ limit: 1000 });
        const employees = response.data || [];

        const deptCounts = {};
        employees.forEach((emp) => {
          const deptName = emp.jobData?.departmentId?.name || emp.department?.name || "Digər";
          deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
        });

        const chartData = Object.keys(deptCounts).map((dept) => ({
          department: dept,
          count: deptCounts[dept],
        }));

        chartData.sort((a, b) => b.count - a.count);
        setData(chartData.slice(0, 10)); // Top 10 departments
      } catch (error) {
        console.error("Failed to fetch department stats", error);
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
                Qurumunuzun Statistikası
              </CardTitle>
              <CardDescription className="text-xs">
                Əməkdaşların struktura görə paylanması
              </CardDescription>
           </div>
           <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
             <BarChart3 className="h-4 w-4 text-gray-500" />
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
          <ResponsiveBar
            data={data}
            keys={["count"]}
            indexBy="department"
            margin={{ top: 20, right: 20, bottom: 60, left: 40 }} // Adjusted margins
            padding={0.4}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={['#124459']} // Brand color
            borderRadius={4}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: -20,
              legend: "",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: 0,
              legend: "",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            enableGridY={true}
            gridYValues={5}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 11,
                    fill: "#64748b",
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#f1f5f9",
                  strokeWidth: 1,
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
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
            role="application"
            ariaLabel="Departamentlər üzrə işçi sayı"
          />
        )}
      </CardContent>
    </Card>
  );
}
