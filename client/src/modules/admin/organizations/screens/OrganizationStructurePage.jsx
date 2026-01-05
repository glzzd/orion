import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { ArrowLeft, Save, ChevronRight, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import { getOrganizationById } from "../api/organizationApi";
import { getAllOrgUnits, createOrgUnit, updateOrgUnit } from "../api/orgUnitApi";
import { PERMISSIONS } from "@/consts/permissions";
import { useAuth } from "@/hooks/useAuth";

const OrganizationStructurePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const perms = new Set(user?.permissions || []);
  const canEdit = perms.has(PERMISSIONS.ADMIN.ORGANIZATIONS);

  const [org, setOrg] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "DEPARTMENT",
    parentId: null,
    classification: "INTERNAL",
    status: "ACTIVE",
    metadata: { shortName: "" },
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const o = await getOrganizationById(id);
        setOrg(o);
        const data = await getAllOrgUnits(id);
        setUnits(Array.isArray(data) ? data : []);
      } catch (error) {
        const message = error?.response?.data?.message || "Struktur yüklənərkən xəta baş verdi";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const childrenMap = useMemo(() => {
    const m = new Map();
    for (const u of units) {
      const key = u.parentId || "root";
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(u);
    }
    return m;
  }, [units]);

  const tree = useMemo(() => {
    const map = new Map(units.map(u => [u._id, { ...u, children: [] }]));
    const roots = [];
    for (const u of map.values()) {
      if (u.parentId) {
        const parent = map.get(u.parentId);
        if (parent) parent.children.push(u);
        else roots.push(u);
      } else {
        roots.push(u);
      }
    }
    return roots;
  }, [units]);

  const selectedUnit = useMemo(() => units.find(u => u._id === selectedUnitId) || null, [units, selectedUnitId]);
  const visibleUnits = useMemo(() => {
    if (!selectedUnit) return units;
    const ids = new Set();
    const stack = [selectedUnit._id];
    while (stack.length) {
      const current = stack.pop();
      ids.add(current);
      const children = childrenMap.get(current) || [];
      for (const child of children) {
        stack.push(child._id);
      }
    }
    return units.filter(u => ids.has(u._id));
  }, [units, selectedUnit, childrenMap]);

  const filteredUnits = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = visibleUnits;
    if (!term) return base;
    return base.filter(u => (u.name || "").toLowerCase().includes(term) || (u.code || "").toLowerCase().includes(term));
  }, [visibleUnits, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / PAGE_SIZE));
  const paginatedUnits = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUnits.slice(start, start + PAGE_SIZE);
  }, [filteredUnits, page]);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectUnit = (u) => {
    setSelectedUnitId(u._id);
    setFormMode("update");
    setFormData({
      name: u.name || "",
      code: u.code || "",
      type: u.type || "DEPARTMENT",
      parentId: u.parentId || null,
      classification: u.classification || "INTERNAL",
      status: u.status || "ACTIVE",
      metadata: { shortName: u.metadata?.shortName || "" },
    });
  };

  const resetCreateForm = () => {
    setFormMode("create");
    setFormData({
      name: "",
      code: "",
      type: "DEPARTMENT",
      parentId: selectedUnitId || null,
      classification: "INTERNAL",
      status: "ACTIVE",
      metadata: { shortName: "" },
    });
  };

  const clearSelection = () => {
    setSelectedUnitId(null);
    setFormMode("create");
    setFormData({
      name: "",
      code: "",
      type: "DEPARTMENT",
      parentId: null,
      classification: "INTERNAL",
      status: "ACTIVE",
      metadata: { shortName: "" },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (formMode === "create") {
        const payload = { ...formData, tenantId: id };
        const created = await createOrgUnit(payload);
        setUnits(prev => [...prev, created]);
        toast.success("Struktur elementi əlavə edildi");
        resetCreateForm();
      } else {
        const payload = { ...formData, tenantId: id };
        const updated = await updateOrgUnit(selectedUnitId, payload);
        setUnits(prev => prev.map(u => u._id === updated._id ? updated : u));
        toast.success("Struktur elementi yeniləndi");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Əməliyyat zamanı xəta baş verdi";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const Connector = () => {
    return (
      <div className="relative w-4 h-6 mr-1">
        <div className="absolute left-2 top-0 h-3 border-l border-slate-300" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 border-t border-slate-300" />
      </div>
    );
  };

  const renderNode = (node, level = 0) => {
    const isOpen = !!expanded[node._id];
    return (
      <div key={node._id} className="pl-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-[#F7FAFF]">
          {level > 0 && (
            <Connector />
          )}
          <button
            type="button"
            className="p-1 rounded hover:bg-slate-200"
            onClick={() => toggleExpand(node._id)}
          >
            {node.children.length > 0 ? (isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />) : <span className="inline-block w-4" />}
          </button>
          <button
            type="button"
            className={`text-sm ${selectedUnitId === node._id ? "font-semibold text-[#124459]" : "text-slate-700"} hover:underline`}
            onClick={() => handleSelectUnit(node)}
          >
            {node.name}
          </button>
        </div>
        {isOpen && node.children.length > 0 && (
          <div className="pl-6 border-l border-slate-300">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 overflow-hidden">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/organizations")}>
          <ArrowLeft className="size-5 text-[#124459]" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#124459]">Struktur</h1>
          <p className="text-sm text-[#124459]/70">{org?.organization_name || ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 max-h-[calc(100dvh-220px)] overflow-hidden flex flex-col">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Yüklənir...</div>
          ) : (
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#124459]/50" />
                <input
                  className="h-10 w-full rounded-md border border-[#124459]/20 bg-white pl-10 pr-3 text-sm outline-none ring-0 focus:border-[#124459]/40"
                  placeholder="Axtarış"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-[#124459]/60">Element: {filteredUnits.length}</div>
              <div className="flex-1 overflow-auto pr-2">
                {tree.map(root => renderNode(root))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 max-h-[calc(100dvh-220px)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#124459]">Struktur düzülüşü</h3>
              <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={clearSelection} disabled={!selectedUnitId}>Seçimi sıfırla</Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-[#124459]/60">Cəmi: {filteredUnits.length}</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Əvvəlki</Button>
                  <span className="text-xs text-[#124459]/80">Səhifə {page} / {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Sonrakı</Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <Table className="text-[13px]">
                  <TableHeader>
                    <TableRow className="sticky top-0 bg-white">
                      <TableHead>Ad</TableHead>
                      <TableHead>Kod</TableHead>
                      <TableHead>Növ</TableHead>
                      <TableHead>Yol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">Yüklənir...</TableCell>
                      </TableRow>
                    ) : paginatedUnits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">Element yoxdur</TableCell>
                      </TableRow>
                    ) : (
                      paginatedUnits.map(u => (
                        <TableRow key={u._id} className="hover:bg-[#F7FAFF]" onClick={() => handleSelectUnit(u)}>
                          <TableCell className="px-4 py-3">
                            <span className="font-medium text-[#124459]">{u.name}</span>
                          </TableCell>
                          <TableCell className="px-4 py-3">{u.code}</TableCell>
                          <TableCell className="px-4 py-3">{u.type}</TableCell>
                          <TableCell className="px-4 py-3">{u.path}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Kod</Label>
                    <Input id="code" value={formData.code} onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Növ</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="HEAD_OFFICE">Baş idarə</option>
                      <option value="OFFICE">İdarə</option>
                      <option value="DIVISION">Şöbə</option>
                      <option value="DEPARTMENT">Bölmə</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent">Valideyn</Label>
                    <select
                      id="parent"
                      value={formData.parentId || ""}
                      onChange={e => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Kök</option>
                      {units.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.path})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Qısa ad</Label>
                    <Input id="shortName" value={formData.metadata.shortName} onChange={e => setFormData(prev => ({ ...prev, metadata: { ...prev.metadata, shortName: e.target.value } }))} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-[#124459] hover:bg-[#0f2a3a]" disabled={saving}>
                    {saving ? <Save className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                    {formMode === "create" ? "Əlavə et" : "Yadda saxla"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationStructurePage;
