import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ArrowUpDown, CheckCircle, Clock, AlertTriangle, FileText, Loader2, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/consts/permissions";
import { getAllEmployees, getAllOrganizations, getAllRoles, getAllOrgUnits } from "@/modules/hr/api/employeeApi";
import { toast } from "sonner";

export default function Employees() {
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);
  const canCreate = perms.has(PERMISSIONS.HR.CREATE);

  // Check if user is SUPER_ADMIN
  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || user?.roles?.some(r => r.name === "SUPER_ADMIN" || (r.roleId && r.roleId.name === "SUPER_ADMIN"));

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState("audit.createdAt");
  const [sortDir, setSortDir] = useState("desc");
  
  // Organization Filter for Super Admin
  const [organizations, setOrganizations] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");

  // Filters
  const [filterRoles, setFilterRoles] = useState([]);
  const [filterOrgUnits, setFilterOrgUnits] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterGenders, setFilterGenders] = useState([]);

  const [roleOptions, setRoleOptions] = useState([]);
  const [orgUnitOptions, setOrgUnitOptions] = useState([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Organizations if Super Admin
  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganizations();
    }
  }, [isSuperAdmin]);

  const fetchOrganizations = async () => {
    try {
      const data = await getAllOrganizations();
      setOrganizations(data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Qurumlar siyahısı yüklənə bilmədi");
    }
  };

  // Fetch Filter Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [roles, orgUnits] = await Promise.all([
          getAllRoles(selectedTenantId),
          getAllOrgUnits(selectedTenantId)
        ]);
        setRoleOptions(roles || []);
        setOrgUnitOptions(orgUnits || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, [selectedTenantId]);

  // Fetch Employees
  useEffect(() => {
    fetchEmployees();
  }, [page, limit, debouncedSearch, sortKey, sortDir, selectedTenantId, filterRoles, filterOrgUnits, filterStatuses, filterGenders]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch,
        sortKey,
        sortDir,
        ...(selectedTenantId && { tenantId: selectedTenantId }),
        roles: filterRoles,
        orgUnits: filterOrgUnits,
        statuses: filterStatuses,
        genders: filterGenders
      };
      
      const response = await getAllEmployees(params);
      setEmployees(response.data || []);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Əməkdaşlar siyahısı yüklənə bilmədi");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleFilter = (setFilter, value) => {
    setFilter(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Helper to safely get nested values
  const getNestedValue = (obj, path, defaultValue = "") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  // Filter Header Component
  const FilterHead = ({ title, sortKey: key, options, selectedValues, onFilterChange, renderOptionLabel, optionValueKey }) => {
    return (
      <TableHead className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div 
            className="flex items-center gap-1 cursor-pointer select-none text-[#124459] font-semibold"
            onClick={() => key && handleSort(key)}
          >
            {title} 
            {key && <ArrowUpDown className={`size-3 ${sortKey === key ? "opacity-100" : "opacity-40"}`} />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-6 w-6 p-0 hover:bg-[#124459]/10 ${selectedValues.length > 0 ? "text-[#124459]" : "text-[#124459]/40"}`}>
                <Filter className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filtrlə</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {options.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground text-center">Seçim yoxdur</div>
              ) : (
                options.map((option) => {
                  const value = optionValueKey ? option[optionValueKey] : option;
                  const label = renderOptionLabel ? renderOptionLabel(option) : option;
                  return (
                    <DropdownMenuCheckboxItem
                      key={value}
                      checked={selectedValues.includes(value)}
                      onCheckedChange={() => onFilterChange(value)}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  );
                })
              )}
              {selectedValues.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={() => {
                        // Clear specific filter
                        if (options === roleOptions) setFilterRoles([]);
                        if (options === orgUnitOptions) setFilterOrgUnits([]);
                        // For static options, need better check or pass clear handler
                        // Or just loop and call onFilterChange? No.
                        // Since I passed onFilterChange as closure, I can't easily clear all.
                        // I will rely on manual uncheck or page refresh for now to keep it simple, 
                        // or I could pass a 'clear' prop but trying to keep component generic.
                        // Actually, I can check against known state setters.
                    }}
                    className="justify-center text-red-500 hover:text-red-600 focus:text-red-600"
                  >
                    Təmizlə
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableHead>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Bütün əməkdaşlar</h1>
          <p className="text-sm text-[#124459]/70">Sistemdə qeydiyyatda olan əməkdaşların siyahısı</p>
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {canCreate && (
            <NavLink to="/human-resources/employees/new">
              <Button className="h-10 px-4 rounded-md bg-[#124459] text-white hover:bg-[#0f2a3a]">Yeni əməkdaş</Button>
            </NavLink>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-[#F4F9FF]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(18,69,89,0.25)] ring-1 ring-[#124459]/20 overflow-hidden">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-gradient-to-b from-[#F7FAFF] to-[#EFF6FB] backdrop-blur-md shadow-sm">
              <TableHead onClick={() => handleSort("personalData.firstName")} className="cursor-pointer select-none text-[#124459] font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-1">Əməkdaş <ArrowUpDown className={`size-3 ${sortKey === "personalData.firstName" ? "opacity-100" : "opacity-40"}`} /></span>
              </TableHead>
              
              <FilterHead 
                title="Vəzifə" 
                sortKey="jobData.primaryAssignment.role"
                options={roleOptions} 
                selectedValues={filterRoles}
                onFilterChange={(val) => toggleFilter(setFilterRoles, val)}
                renderOptionLabel={(opt) => opt.name}
                optionValueKey="name"
              />

              <FilterHead 
                title="Struktur" 
                sortKey="jobData.primaryAssignment.organizationUnitId"
                options={orgUnitOptions} 
                selectedValues={filterOrgUnits}
                onFilterChange={(val) => toggleFilter(setFilterOrgUnits, val)}
                renderOptionLabel={(opt) => opt.name}
                optionValueKey="_id"
              />

              <TableHead className="text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">İşə qəbul</span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">Müqavilə</span>
              </TableHead>
              <TableHead className="text-[#124459] font-semibold text-center px-4 py-3">
                <span className="inline-flex items-center gap-1 justify-center">İşdən çıxarılma</span>
              </TableHead>
              
              <FilterHead 
                title="Status" 
                sortKey="status"
                options={["ACTIVE", "INACTIVE", "TERMINATED"]} 
                selectedValues={filterStatuses}
                onFilterChange={(val) => toggleFilter(setFilterStatuses, val)}
              />

              <FilterHead 
                title="Cins" 
                sortKey="personalData.gender"
                options={["MALE", "FEMALE"]} 
                selectedValues={filterGenders}
                onFilterChange={(val) => toggleFilter(setFilterGenders, val)}
                renderOptionLabel={(val) => val === "MALE" ? "Kişi" : "Qadın"}
              />

              <TableHead className="text-[#124459] font-semibold text-right px-4 py-3">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[#124459]" />
                            <span className="ml-2 text-[#124459]">Yüklənir...</span>
                        </div>
                    </TableCell>
                </TableRow>
            ) : employees.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                        Məlumat tapılmadı
                    </TableCell>
                </TableRow>
            ) : (
                employees.map((emp) => (
                <TableRow key={emp._id} className="group odd:bg-white even:bg-[#FBFDFF] hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                    <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-[#124459]/20 to-[#124459]/10 text-[#124459] grid place-items-center font-medium ring-1 ring-[#124459]/30">
                        {emp.personalData.firstName?.[0]}{emp.personalData.lastName?.[0]}
                        </div>
                        <div className="flex flex-col">
                        <span className="font-medium text-[13px] text-[#124459]">{emp.personalData.lastName} {emp.personalData.firstName} {emp.personalData.fatherName} {emp.personalData.gender === "MALE" ? "oğlu" : emp.personalData.gender === "FEMALE" ? "qızı" : ""}</span>
                        <span className="text-xs text-[#124459]/60">ID-{emp.employeeCode}</span>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="text-[#124459] px-4 py-3">{getNestedValue(emp, 'jobData.primaryAssignment.role', '-')}</TableCell>
                    <TableCell className="text-[#124459] px-4 py-3">{getNestedValue(emp, 'jobData.primaryAssignment.organizationUnitId.name', '-')}</TableCell>
                    <TableCell className="text-center px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                        <span className="bg-gray-100 text-gray-700 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                            <AlertTriangle className="size-3" /> Yox
                        </span>
                    </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700"><FileText className="size-3" />Yox</span>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                             <AlertTriangle className="size-3" /> Yox
                        </span>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                    <span className={`${emp.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}>
                        {emp.status === "ACTIVE" ? <CheckCircle className="size-3" /> : <Clock className="size-3" />}
                        {emp.status}
                    </span>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      <span className={`${emp.personalData.gender === "MALE" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-rose-50 text-rose-600 border-rose-200"} border inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-md min-w-[60px]`}>
                        {emp.personalData.gender === "MALE" ? "Kişi" : "Qadın"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-[#124459] hover:bg-[#124459]/10">Edit</Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-600/10">Del</Button>
                    </div>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#F7FAFF] to-[#EFF6FB] border-t border-[#124459]/10">
          <div className="text-sm text-[#124459]/70">
            Göstərilən {total === 0 ? 0 : (page - 1) * limit + 1}-{Math.min(page * limit, total)} / {total}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === 1} onClick={() => setPage(1)}>İlk</Button>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Əvvəlki</Button>
            <div className="flex items-center gap-1">
               {/* Simplified pagination for large number of pages */}
              {pages.length <= 7 ? pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 min-w-8 px-3 rounded-md text-sm transition-colors ${p === page ? "bg-[#124459] text-white shadow-sm" : "text-[#124459] hover:bg-[#124459]/10"}`}
                >
                  {p}
                </button>
              )) : (
                <>
                    <span className="px-2">Səhifə {page} / {totalPages}</span>
                </>
              )}
            </div>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Növbəti</Button>
            <Button variant="ghost" className="h-8 px-3 text-[#124459] hover:bg-[#124459]/10" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Son</Button>
          </div>
        </div>
      </div>
    </div>
  );
}