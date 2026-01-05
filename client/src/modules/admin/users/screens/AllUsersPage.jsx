import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ArrowUpDown, CheckCircle, Clock, AlertTriangle, FileText, UserPlus, Trash2, Edit2, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/consts/permissions";
import { getAllUsers, deleteUser } from "../api/userApi";
import { getAllOrganizations } from "@/modules/hr/api/employeeApi";
import { toast } from "sonner";

export default function AllUsersPage() {
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);
  const canCreate = perms.has(PERMISSIONS.ADMIN.USERS);
  const canDelete = perms.has(PERMISSIONS.ADMIN.USERS); // Assuming create implies manage or separate perms
  const canEdit = perms.has(PERMISSIONS.ADMIN.USERS);
  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || user?.roles?.some(r => r.name === "SUPER_ADMIN" || (r.roleId && r.roleId.name === "SUPER_ADMIN"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [organizations, setOrganizations] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");

  const pageSize = 10;

  

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: pageSize,
          search,
          sortKey,
          sortDir,
        };
        if (selectedTenantId) params.tenantId = selectedTenantId;
        const res = await getAllUsers(params);
        setUsers(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalUsers(res.meta.total);
      } catch {
        toast.error("İstifadəçiləri gətirərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search, sortKey, sortDir, selectedTenantId]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    (async () => {
      try {
        const data = await getAllOrganizations();
        setOrganizations(Array.isArray(data) ? data : []);
      } catch {
        void 0;
      }
    })();
  }, [isSuperAdmin]);

  const handleDelete = async (id) => {
      if(!window.confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) return;
      try {
          await deleteUser(id);
          toast.success("İstifadəçi silindi");
          const params = {
            page,
            limit: pageSize,
            search,
            sortKey,
            sortDir,
          };
          if (selectedTenantId) params.tenantId = selectedTenantId;
          setLoading(true);
          const res = await getAllUsers(params);
          setUsers(res.data);
          setTotalPages(res.meta.totalPages);
          setTotalUsers(res.meta.total);
          setLoading(false);
      } catch (error) {
          toast.error(error.response?.data?.message || "Xəta baş verdi");
      }
  }

  const handleSort = (key) => {
      setPage(1);
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
          <h1 className="text-2xl font-semibold text-[#124459]">Bütün istifadəçilər</h1>
          <p className="text-sm text-[#124459]/70">Sistemdə qeydiyyatda olan istifadəçilərin siyahısı</p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <div className="relative">
              <select
                className="h-10 rounded-md border border-[#124459]/20 bg-white px-3 text-sm outline-none focus:border-[#124459]/40 min-w-[200px]"
                value={selectedTenantId}
                onChange={(e) => {
                    setSelectedTenantId(e.target.value);
                    setPage(1);
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
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />
          </div>
          {canCreate && (
            <NavLink to="/admin/users/add">
              <Button className="h-10 px-4 rounded-md bg-[#124459] text-white hover:bg-[#0f2a3a]">
                  <UserPlus className="mr-2 size-4" />
                  Yeni istifadəçi
              </Button>
            </NavLink>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-[#F4F9FF]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(18,69,89,0.25)] ring-1 ring-[#124459]/20 overflow-hidden">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-gradient-to-b from-[#F7FAFF] to-[#EFF6FB] backdrop-blur-md shadow-sm">
              <TableHead onClick={() => handleSort("username")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">İstifadəçi adı <ArrowUpDown className={`size-3 ${sortKey === "username" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead onClick={() => handleSort("personalData.firstName")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Ad Soyad <ArrowUpDown className={`size-3 ${sortKey === "personalData.firstName" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold px-4 py-3">
                Email
              </TableHead>
              <TableHead className="text-[#124459] font-semibold text-center px-4 py-3">
                Rollar
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer select-none text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">Status <ArrowUpDown className={`size-3 ${sortKey === "status" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold text-right px-4 py-3">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">Yüklənir...</TableCell>
                </TableRow>
            ) : users.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">İstifadəçi tapılmadı</TableCell>
                </TableRow>
            ) : (
                users.map((u) => (
                <TableRow key={u._id} className="group odd:bg-white even:bg-[#FBFDFF] hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                    <TableCell className="px-4 py-3 font-medium text-[#124459]">{u.username}</TableCell>
                    <TableCell className="px-4 py-3 text-[#124459]">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gradient-to-br from-[#124459]/20 to-[#124459]/10 text-[#124459] grid place-items-center font-medium ring-1 ring-[#124459]/30">
                            {u.personalData?.firstName?.[0]}{u.personalData?.lastName?.[0]}
                            </div>
                            <div className="flex flex-col">
                            <span className="font-medium text-[13px] text-[#124459]">{u.personalData?.firstName} {u.personalData?.lastName}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#124459]">{u.email}</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                            {u.roles?.map((r, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    <Shield className="size-3" />
                                    {r.roleId?.name || "Naməlum"}
                                </span>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                    <span className={`${u.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}>
                        {u.status === "ACTIVE" ? <CheckCircle className="size-3" /> : <AlertTriangle className="size-3" />}
                        {u.status === "ACTIVE" ? "Aktiv" : "Deaktiv"}
                    </span>
                    </TableCell>
                    <TableCell className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                            <NavLink to={`/admin/users/edit/${u._id}`}>
                                <Button variant="ghost" size="icon" className="text-[#124459] hover:bg-[#124459]/10">
                                    <Edit2 className="size-4" />
                                </Button>
                            </NavLink>
                        )}
                        {canDelete && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-600 hover:bg-red-600/10"
                                onClick={() => handleDelete(u._id)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        )}
                    </div>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#F7FAFF] to-[#EFF6FB] border-t border-[#124459]/10">
          <div className="text-sm text-[#124459]/70">
            Göstərilən {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalUsers)} / {totalUsers}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === 1} onClick={() => setPage(1)}>İlk</Button>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Əvvəlki</Button>
            <div className="flex items-center gap-1">
                {/* Simplified Pagination for now */}
                <span className="text-sm text-[#124459] font-medium px-2">
                    Səhifə {page} / {totalPages}
                </span>
            </div>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Növbəti</Button>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Son</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
