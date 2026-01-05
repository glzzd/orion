import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllEmployees } from "@/modules/hr/api/employeeApi";
import { Cake, Loader2, Calendar } from "lucide-react";

export default function HrStats() {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBirthdays() {
      try {
        const response = await getAllEmployees({ limit: 1000 });
        const employees = response.data || [];
        
        const currentMonth = new Date().getMonth();
        const upcoming = employees.filter(emp => {
          const dobString = emp.personalData?.dateOfBirth || emp.profile?.birthDate;
          if (!dobString) return false;
          
          const date = new Date(dobString);
          if (isNaN(date.getTime())) return false;
          
          return date.getMonth() === currentMonth;
        });

        upcoming.sort((a, b) => {
           const dateA = new Date(a.personalData?.dateOfBirth || a.profile?.birthDate).getDate();
           const dateB = new Date(b.personalData?.dateOfBirth || b.profile?.birthDate).getDate();
           return dateA - dateB;
        });

        setBirthdays(upcoming);
      } catch (error) {
        console.error("Failed to fetch birthdays", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBirthdays();
  }, []);

  return (
    <Card className="col-span-1 shadow-sm border-none h-full flex flex-col rounded-xl bg-white">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center">
                <Cake className="h-5 w-5 text-pink-500" />
             </div>
             <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Bu Ay Doğulanlar
                </CardTitle>
                <CardDescription className="text-xs">
                  Bu ay ərzində yeni yaşını qeyd edən əməkdaşlar
                </CardDescription>
             </div>
          </div>
          <span className="bg-pink-50 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">
            {birthdays.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-[400px]">
        {loading ? (
           <div className="flex justify-center py-10">
             <Loader2 className="h-8 w-8 animate-spin text-pink-300" />
           </div>
        ) : birthdays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Calendar className="h-10 w-10 opacity-20" />
            <p className="text-sm">Bu ay ad günü olan yoxdur.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {birthdays.map((emp, index) => {
              const dobString = emp.personalData?.dateOfBirth || emp.profile?.birthDate;
              if (!dobString) return null;

              const date = new Date(dobString);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const formattedDate = `${day}.${month}.${year}`;
              const currentYear = new Date().getFullYear();
              const turningAge = currentYear - year;
              
              const p = emp.personalData || emp.profile || {};
              const fullName = p.fullName || `${p.lastName || ''} ${p.firstName || ''} ${p.fatherName || ''}`.trim();
              
              // Initials for avatar
              const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              
              // Random soft color for avatar based on name length or something stable
              const colors = [
                  "bg-blue-50 text-blue-600",
                  "bg-emerald-50 text-emerald-600",
                  "bg-violet-50 text-violet-600",
                  "bg-orange-50 text-orange-600",
              ];
              const colorClass = colors[fullName.length % colors.length];

              return (
                <div key={emp._id || index} className="flex items-center p-4 hover:bg-gray-50 transition-colors group">
                   <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center font-bold text-xs mr-3`}>
                      {initials}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <span>{formattedDate}</span>
                        <span className="text-gray-300">•</span>
                        <span>{turningAge} yaş</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                     <div className="h-2 w-2 rounded-full bg-pink-400"></div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
