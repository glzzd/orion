import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ArrowUpDown, Building, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/consts/permissions";
import { getAllOrganizations } from "../api/organizationApi";
import { toast } from "sonner";
import { EyeIcon } from "lucide-react";
import { SignatureIcon } from "lucide-react";
import { Group } from "lucide-react";
import { API_BASE_URL } from "@/consts/apiEndpoints";

const AllOrganizationsPage = () => {
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);
  const canCreate = perms.has(PERMISSIONS.ADMIN.ORGANIZATIONS);
  const baseOrigin = API_BASE_URL.replace(/\/api$/, "");

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("organization_name");
  const [sortDir, setSortDir] = useState("asc");

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await getAllOrganizations();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error?.response?.data?.message || "Qurumlar yüklənərkən xəta baş verdi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrganizations();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = organizations
    .filter((o) => o.organization_name?.toLowerCase().includes(search.toLowerCase()) || o.organization_code?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey] || "";
      const bv = b[sortKey] || "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Bütün qurumlar</h1>
          <p className="text-sm text-[#124459]/70">Sistemdə qeydiyyatda olan qurum və təşkilatlar</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#124459]/50" />
            <input 
                className="h-10 w-64 rounded-md border border-[#124459]/20 bg-white pl-10 pr-3 text-sm outline-none ring-0 focus:border-[#124459]/40" 
                placeholder="Axtarış" 
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
            />
          </div>
          {canCreate && (
            <NavLink to="/admin/organizations/add">
              <Button className="h-10 px-4 rounded-md bg-[#124459] text-white hover:bg-[#0f2a3a]">
                  <Plus className="mr-2 size-4" />
                  Yeni qurum
              </Button>
            </NavLink>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-[#F4F9FF]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(18,69,89,0.25)] ring-1 ring-[#124459]/20 overflow-hidden">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-gradient-to-b from-[#F7FAFF] to-[#EFF6FB] backdrop-blur-md shadow-sm">
              <TableHead onClick={() => handleSort("organization_name")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Qurum adı <ArrowUpDown className={`size-3 ${sortKey === "organization_name" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => handleSort("organization_code")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Kod <ArrowUpDown className={`size-3 ${sortKey === "organization_code" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => handleSort("organization_type")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Növ <ArrowUpDown className={`size-3 ${sortKey === "organization_type" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => handleSort("organization_status")} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">Status <ArrowUpDown className={`size-3 ${sortKey === "organization_status" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold text-right px-4 py-3">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">Yüklənir...</TableCell>
                </TableRow>
            ) : filtered.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">Qurum tapılmadı</TableCell>
                </TableRow>
            ) : (
                filtered.map((o) => (
                <TableRow key={o._id} className="group odd:bg-white even:bg-[#FBFDFF] hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                    <TableCell className="px-4 py-3 font-medium text-[#124459]">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-[#124459]/20 to-[#124459]/10 text-[#124459] grid place-items-center font-medium ring-1 ring-[#124459]/30 overflow-hidden">
                          {o.logoUrl ? (
                            <img src={`${baseOrigin}${o.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Building className="size-3" />
                          )}
                        </div>
                        <span>{o.organization_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#124459]">{o.organization_code || "-"}</TableCell>
                    <TableCell className="px-4 py-3 text-[#124459]">
                      {o.organization_type === "PRIVATE" ? "Özəl" : o.organization_type === "STATE" ? "Dövlət" : "Hərbi"}
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      <span className={`${o.organization_status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}>
                        {o.organization_status === "ACTIVE" ? "Aktiv" : o.organization_status === "SUSPENDED" ? "Dayandırılıb" : "Arxivləndi"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <NavLink to={`/admin/organizations/${o._id}`}>
                          <Button variant="ghost" size="sm" className="text-[#124459] hover:bg-green-700/10">
                            <EyeIcon className="text-green-700 hover:text-white/10"/> Bax
                          </Button>
                        </NavLink>
                        <NavLink to={`/admin/organizations/${o._id}`}>
                          <Button variant="ghost" size="sm" className="text-[#124459] hover:bg-orange-700/10">
                            <Group className="text-orange-700 hover:text-white/10"/> Struktur
                          </Button>
                        </NavLink>
                       
                      </div>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#F7FAFF] to-[#EFF6FB] border-t border-[#124459]/10">
          <div className="text-sm text-[#124459]/70">
            Cəmi {filtered.length} qurum və ya təşkilat
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrganizationsPage
