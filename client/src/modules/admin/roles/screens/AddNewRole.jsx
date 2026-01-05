import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createRole, getAllPermissions, getAllOrganizations } from "../api/roleApi";
import { useAuth } from "@/hooks/useAuth";

export default function AddNewRole() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin =
    user?.roles?.includes("SUPER_ADMIN") ||
    user?.roles?.some((r) => r.name === "SUPER_ADMIN" || (r.roleId && r.roleId.name === "SUPER_ADMIN"));

  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const orgs = await getAllOrganizations();
        setOrganizations(Array.isArray(orgs) ? orgs : []);
      } catch {
        void 0;
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const perms = await getAllPermissions(selectedTenantId);
        setPermissions(Array.isArray(perms) ? perms : []);
      } catch {
        toast.error("Səlahiyyətlər yüklənərkən xəta baş verdi");
      }
    })();
  }, [selectedTenantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (id) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      return [...prev, id];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name.trim()) {
        toast.error("Rol adı zəruridir");
        setLoading(false);
        return;
      }
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        tenantId: selectedTenantId || undefined,
        permissions: selectedPermissions
      };
      await createRole(payload);
      toast.success("Rol uğurla yaradıldı");
      navigate("/admin/roles");
    } catch (error) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/roles")}>
          <ArrowLeft className="size-5 text-[#124459]" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#124459]">Yeni rol</h1>
          <p className="text-sm text-[#124459]/70">Sistemə yeni rol əlavə edin</p>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Qurum seçin</Label>
              <select
                id="tenant"
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Cari qurum</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.organization_name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Super admin üçün digər qurumları seçmək mümkündür.</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rol adı</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Rol adı" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Təsvir</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Qısa təsvir" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-[#124459] border-b pb-2">Səlahiyyətlər</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.length === 0 ? (
                <div className="text-sm text-gray-500">Səlahiyyət tapılmadı</div>
              ) : (
                permissions.map((p) => (
                  <label key={p._id} className="flex items-center gap-3 rounded-md border px-3 py-2 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(p._id)}
                      onChange={() => togglePermission(p._id)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#124459]">{p.name}</span>
                      <span className="text-xs text-[#124459]/70">{p.slug}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-[#124459] hover:bg-[#0f2a3a]" disabled={loading}>
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Yadda saxla
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
}
