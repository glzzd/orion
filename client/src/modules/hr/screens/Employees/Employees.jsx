import React from "react";
import { NavLink } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ArrowUpDown, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import employees from "@/consts/mockDatas/employees.json";

export default function Employees() {
  const pageSize = 10;
  const [page, setPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState("name");
  const [sortDir, setSortDir] = React.useState("asc");
  const getVal = (emp, key) => {
    if (key === "name") return emp.profile.fullName.toLowerCase();
    if (key === "position") return emp.position.title.toLowerCase();
    if (key === "department") return emp.department.name.toLowerCase();
    if (key === "status") return emp.employment.status.toLowerCase();
    if (key === "onboarding") return Number(emp.onboarding?.completedPercent || 0);
    if (key === "contracts") return Number((emp.contracts || []).filter((c) => c.status === "Aktiv").length);
    if (key === "offboarding") return (emp.offboarding?.status || "").toLowerCase();
    return "";
  };
  const sortedEmployees = React.useMemo(() => {
    const arr = [...employees];
    arr.sort((a, b) => {
      const va = getVal(a, sortKey);
      const vb = getVal(b, sortKey);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sortKey, sortDir]);
  const totalPages = Math.ceil(sortedEmployees.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const currentEmployees = sortedEmployees.slice(startIndex, startIndex + pageSize);
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1 && totalPages >= 1) setPage(1);
  }, [totalPages, page]);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Bütün əməkdaşlar</h1>
          <p className="text-sm text-[#124459]/70">Sistemdə qeydiyyatda olan əməkdaşların siyahısı</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#124459]/50" />
            <input className="h-10 w-64 rounded-md border border-[#124459]/20 bg-white pl-10 pr-3 text-sm outline-none ring-0 focus:border-[#124459]/40" placeholder="Axtarış" />
          </div>
          <NavLink to="/human-resources/employees/new">
            <Button className="h-10 px-4 rounded-md bg-[#124459] text-white hover:bg-[#0f2a3a]">Yeni əməkdaş</Button>
          </NavLink>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-[#F4F9FF]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(18,69,89,0.25)] ring-1 ring-[#124459]/20 overflow-hidden">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-gradient-to-b from-[#F7FAFF] to-[#EFF6FB] backdrop-blur-md shadow-sm">
              <TableHead onClick={() => { setPage(1); setSortKey("name"); setSortDir(sortKey === "name" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Əməkdaş <ArrowUpDown className={`size-3 ${sortKey === "name" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => { setPage(1); setSortKey("position"); setSortDir(sortKey === "position" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Vəzifə <ArrowUpDown className={`size-3 ${sortKey === "position" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => { setPage(1); setSortKey("department"); setSortDir(sortKey === "department" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Struktur <ArrowUpDown className={`size-3 ${sortKey === "department" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => { setPage(1); setSortKey("onboarding"); setSortDir(sortKey === "onboarding" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">İşə qəbul <ArrowUpDown className={`size-3 ${sortKey === "onboarding" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => { setPage(1); setSortKey("contracts"); setSortDir(sortKey === "contracts" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">Müqavilə <ArrowUpDown className={`size-3 ${sortKey === "contracts" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => { setPage(1); setSortKey("offboarding"); setSortDir(sortKey === "offboarding" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">İşdən çıxarılma <ArrowUpDown className={`size-3 ${sortKey === "offboarding" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => { setPage(1); setSortKey("status"); setSortDir(sortKey === "status" && sortDir === "asc" ? "desc" : "asc"); }} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">Status <ArrowUpDown className={`size-3 ${sortKey === "status" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold text-right px-4 py-3">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEmployees.map((emp) => (
              <TableRow key={emp.id} className="group odd:bg-white even:bg-[#FBFDFF] hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-[#124459]/20 to-[#124459]/10 text-[#124459] grid place-items-center font-medium ring-1 ring-[#124459]/30">
                      {emp.profile.fullName.split(" ").map((n) => n[0]).slice(0,2).join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[13px] text-[#124459]">{emp.profile.fullName}</span>
                      <span className="text-xs text-[#124459]/60">ID-{String(emp.id).padStart(4, "0")}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[#124459] px-4 py-3">{emp.position.title}</TableCell>
                <TableCell className="text-[#124459] px-4 py-3">{emp.department.name}</TableCell>
                <TableCell className="text-center px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`${emp.onboarding?.status === "Tamamlandı" ? "bg-emerald-100 text-emerald-700" : emp.onboarding?.status === "Davam edir" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-700"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}>
                      {emp.onboarding?.status === "Tamamlandı" ? <CheckCircle className="size-3" /> : emp.onboarding?.status === "Davam edir" ? <Clock className="size-3" /> : <AlertTriangle className="size-3" />}
                      {emp.onboarding?.status || "Yox"}
                    </span>
                    
                  </div>
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {(() => {
                    const active = (emp.contracts || []).filter((c) => c.status === "Aktiv").length;
                    const total = (emp.contracts || []).length;
                    if (active > 0) return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-700"><FileText className="size-3" />Aktiv {active}</span>;
                    if (total > 0) return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700"><FileText className="size-3" />Bitib</span>;
                    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700"><FileText className="size-3" />Yox</span>;
                  })()}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  <span className={`${emp.offboarding?.status === "Planlandı" ? "bg-amber-100 text-amber-700" : emp.offboarding?.status === "Tamamlandı" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}>
                    {emp.offboarding?.status === "Planlandı" ? <Clock className="size-3" /> : emp.offboarding?.status === "Tamamlandı" ? <CheckCircle className="size-3" /> : <AlertTriangle className="size-3" />}
                    {emp.offboarding?.status || "Yox"}
                  </span>
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  <span className={`${emp.employment.status === "Aktiv" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}>
                    {emp.employment.status === "Aktiv" ? <CheckCircle className="size-3" /> : <Clock className="size-3" />}
                    {emp.employment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="text-[#124459] hover:bg-[#124459]/10">Edit</Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-600/10">Del</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#F7FAFF] to-[#EFF6FB] border-t border-[#124459]/10">
          <div className="text-sm text-[#124459]/70">
            Göstərilən {sortedEmployees.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, sortedEmployees.length)} / {sortedEmployees.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === 1} onClick={() => setPage(1)}>İlk</Button>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Əvvəlki</Button>
            <div className="flex items-center gap-1">
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 min-w-8 px-3 rounded-md text-sm transition-colors ${p === page ? "bg-[#124459] text-white shadow-sm" : "text-[#124459] hover:bg-[#124459]/10"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Növbəti</Button>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Son</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
