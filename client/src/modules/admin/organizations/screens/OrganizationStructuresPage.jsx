import React, { useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ChevronRight, ChevronDown, Building } from "lucide-react";
import { getAllOrganizations } from "../api/organizationApi";
import { getAllOrgUnits } from "../api/orgUnitApi";
import { toast } from "sonner";
import { API_BASE_URL } from "@/consts/apiEndpoints";

const OrganizationStructuresPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [unitsByOrg, setUnitsByOrg] = useState({});
  const [unitsLoading, setUnitsLoading] = useState({});

  const baseOrigin = API_BASE_URL.replace(/\/api$/, "");

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return organizations;
    return organizations.filter(
      (o) =>
        (o.organization_name || "").toLowerCase().includes(term) ||
        (o.organization_code || "").toLowerCase().includes(term)
    );
  }, [organizations, search]);

  const toggleRow = async (org) => {
    const id = org._id;
    const next = { ...expanded, [id]: !expanded[id] };
    setExpanded(next);
    if (!next[id]) return;
    if (unitsByOrg[id]) return;
    try {
      setUnitsLoading((prev) => ({ ...prev, [id]: true }));
      const units = await getAllOrgUnits(id);
      setUnitsByOrg((prev) => ({ ...prev, [id]: Array.isArray(units) ? units : [] }));
    } catch (error) {
      const message = error?.response?.data?.message || "Struktur yüklənərkən xəta baş verdi";
      toast.error(message);
    } finally {
      setUnitsLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const buildTree = (units) => {
    const map = new Map(units.map((u) => [u._id, { ...u, children: [] }]));
    const roots = [];
    for (const u of map.values()) {
      if (u.parentId) {
        const p = map.get(u.parentId);
        if (p) p.children.push(u);
        else roots.push(u);
      } else {
        roots.push(u);
      }
    }
    return roots;
  };

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div key={node._id} className="pl-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-[#F7FAFF]">
          {level > 0 && (
            <div className="relative w-4 h-6">
              <div className="absolute left-2 top-0 h-3 border-l border-slate-300" />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 border-t border-slate-300" />
            </div>
          )}
          <span className="text-sm text-slate-700">{node.name}</span>
        </div>
        {hasChildren && (
          <div className="pl-6 border-l border-slate-300">
            {node.children.map((c) => renderNode(c, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#124459]">Strukturlar</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#124459]/50" />
          <input
            className="h-10 w-full rounded-md border border-[#124459]/20 bg-white pl-10 pr-3 text-sm outline-none ring-0 focus:border-[#124459]/40"
            placeholder="Axtarış"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 bg-white">
              <TableHead>Qurum</TableHead>
              <TableHead>Kod</TableHead>
              <TableHead>Növ</TableHead>
              <TableHead className="text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">Yüklənir...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">Qurum tapılmadı</TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <React.Fragment key={o._id}>
                  <TableRow className="group hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-[#124459]/20 to-[#124459]/10 text-[#124459] grid place-items-center font-medium ring-1 ring-[#124459]/30 overflow-hidden">
                          {o.logoUrl ? (
                            <img src={`${baseOrigin}${o.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Building className="size-3" />
                          )}
                        </div>
                        <span className="font-medium text-[#124459]">{o.organization_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#124459]">{o.organization_code || "-"}</TableCell>
                    <TableCell className="px-4 py-3 text-[#124459]">
                      {o.organization_type === "PRIVATE" ? "Özəl" : o.organization_type === "STATE" ? "Dövlət" : "Hərbi"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => toggleRow(o)}>
                        {expanded[o._id] ? <ChevronDown className="size-4 mr-1" /> : <ChevronRight className="size-4 mr-1" />}
                        Struktur
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expanded[o._id] && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-[#FBFDFF] p-4">
                        {unitsLoading[o._id] ? (
                          <div className="py-6 text-center text-gray-500">Struktur yüklənir...</div>
                        ) : (unitsByOrg[o._id] || []).length === 0 ? (
                          <div className="py-6 text-center text-gray-500">Element yoxdur</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-[#124459]/10">
                              <div className="text-sm font-medium text-[#124459] mb-2">İyerarxiya</div>
                              <div className="max-h-[400px] overflow-auto pr-2">
                                {buildTree(unitsByOrg[o._id]).map((root) => renderNode(root))}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-white p-4 ring-1 ring-[#124459]/10">
                              <div className="text-sm font-medium text-[#124459] mb-2">Cədvəl</div>
                              <div className="max-h-[400px] overflow-auto">
                                <Table className="text-[12px]">
                                  <TableHeader>
                                    <TableRow className="sticky top-0 bg-white">
                                      <TableHead>Ad</TableHead>
                                      <TableHead>Kod</TableHead>
                                      <TableHead>Növ</TableHead>
                                      <TableHead>Yol</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {(unitsByOrg[o._id] || []).map((u) => (
                                      <TableRow key={u._id} className="hover:bg-[#F7FAFF]">
                                        <TableCell className="px-4 py-2">
                                          <span className="font-medium text-[#124459]">{u.name}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-2">{u.code}</TableCell>
                                        <TableCell className="px-4 py-2">{u.type}</TableCell>
                                        <TableCell className="px-4 py-2">{u.path}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrganizationStructuresPage;
