import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ArrowUpDown, Shield, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/consts/permissions";
import { getAllRoles, getAllOrganizations } from "../api/roleApi";
import { toast } from "sonner";

export default function AllRoles() {
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);
  const canCreate = perms.has(PERMISSIONS.ADMIN.ROLES);

  const isSuperAdmin =
    user?.roles?.includes("SUPER_ADMIN") ||
    user?.roles?.some((r) => r.name === "SUPER_ADMIN" || (r.roleId && r.roleId.name === "SUPER_ADMIN"));

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [organizations, setOrganizations] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) return;
    (async () => {
      try {
        const orgs = await getAllOrganizations();
        setOrganizations(Array.isArray(orgs) ? orgs : []);
      } catch {
        void 0;
      }
    })();
  }, [isSuperAdmin]);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getAllRoles(selectedTenantId);
        setRoles(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Rolları gətirərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [selectedTenantId, search, sortKey, sortDir]);

  const filteredSorted = useMemo(() => {
    const s = search.trim().toLowerCase();
    let arr = roles;
    if (s) {
      arr = arr.filter((r) => (r.name || "").toLowerCase().includes(s) || (r.description || "").toLowerCase().includes(s));
    }
    arr = arr.slice().sort((a, b) => {
      const av = sortKey === "permissions" ? (a.permissions?.length || 0) : (a[sortKey] || "");
      const bv = sortKey === "permissions" ? (b.permissions?.length || 0) : (b[sortKey] || "");
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [roles, search, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Bütün rollar</h1>
          <p className="text-sm text-[#124459]/70">Sistemdə qeydiyyatda olan rolların siyahısı</p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <div className="relative">
              <select
                className="h-10 rounded-md border border-[#124459]/20 bg-white px-3 text-sm outline-none focus:border-[#124459]/40 min-w-[200px]"
                value={selectedTenantId}
                onChange={(e) => {
                    setSelectedTenantId(e.target.value);
                }}
              >
                <option value="">Bütün Qurumlar</option>
                {organizations.map(org => (
                  <option key={org._id} value={org._id}>{org.organization_name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#124459]/50" />
            <input
              className="h-10 w-64 rounded-md border border-[#124459]/20 bg-white pl-10 pr-3 text-sm outline-none ring-0 focus:border-[#124459]/40"
              placeholder="Axtarış"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {canCreate && (
            <NavLink to="/admin/roles/add">
              <Button className="h-10 px-4 rounded-md bg-[#124459] text-white hover:bg-[#0f2a3a]">
                <UserPlus className="mr-2 size-4" />
                Yeni rol
              </Button>
            </NavLink>
          )}
        </div>
      </div>

      

      <div className="rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-[#F4F9FF]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(18,69,89,0.25)] ring-1 ring-[#124459]/20 overflow-hidden">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-gradient-to-b from-[#F7FAFF] to-[#EFF6FB] backdrop-blur-md shadow-sm">
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">
                  Rol adı <ArrowUpDown className={`size-3 ${sortKey === "name" ? "opacity-100" : "opacity-40"}`} />
                </span>
              </TableHead>
              <TableHead onClick={() => handleSort("description")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">
                  Təsvir <ArrowUpDown className={`size-3 ${sortKey === "description" ? "opacity-100" : "opacity-40"}`} />
                </span>
              </TableHead>
              <TableHead onClick={() => handleSort("permissions")} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">
                  Səlahiyyət sayı <ArrowUpDown className={`size-3 ${sortKey === "permissions" ? "opacity-100" : "opacity-40"}`} />
                </span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold px-4 py-3">Qurum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : filteredSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  Rol tapılmadı
                </TableCell>
              </TableRow>
            ) : (
              filteredSorted.map((r) => (
                <TableRow key={r._id} className="group odd:bg-white even:bg-[#FBFDFF] hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                  <TableCell className="px-4 py-3 font-medium text-[#124459]">
                    <span className="inline-flex items-center gap-2">
                      <Shield className="size-4 text-[#124459]/70" />
                      {r.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[#124459]">{r.description || "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {r.permissions?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-[#124459]">{organizations.find((o) => o._id === r.tenantId)?.organization_name || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
