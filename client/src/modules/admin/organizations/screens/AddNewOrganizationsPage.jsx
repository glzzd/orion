import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createOrganization } from "../api/organizationApi";

const AddNewOrganizations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    organization_name: "",
    organization_code: "",
    organization_type: "PRIVATE",
    organization_profile: {
      legalName: "",
      registrationNumber: "",
      country: "",
      address: "",
    },
    features: {
      dashboard: true,
      hrm: true,
      payroll: false,
      performance: false,
      attendance: false,
      clearanceManagement: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      organization_profile: { ...prev.organization_profile, [name]: value },
    }));
  };

  const handleFeatureToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, [name]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let payload = { ...formData };
      if (logoFile) {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(logoFile);
        });
        payload.logoBase64 = dataUrl;
      }
      await createOrganization(payload);
      toast.success("Qurum uğurla yaradıldı");
      navigate("/admin/organizations");
    } catch (error) {
      const message = error?.response?.data?.message || "Qurum yaradılarkən xəta baş verdi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/organizations")}>
          <ArrowLeft className="size-5 text-[#124459]" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#124459]">Yeni qurum</h1>
          <p className="text-sm text-[#124459]/70">Sistemə yeni qurum və ya təşkilat əlavə edin</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#124459] border-b pb-2">Ümumi məlumat</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-[#D1D5DB] flex items-center justify-center mb-3 relative overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[#9CA3AF] text-xs">Logo yoxdur</span>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setLogoFile(f);
                    setLogoPreview(f ? URL.createObjectURL(f) : "");
                  }} />
                </div>
                <div className="text-xs text-[#6B7280]">PNG/JPG, max ~10MB</div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="organization_name">Qurum adı</Label>
                <Input
                  id="organization_name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="organization_code">Qurum kodu</Label>
                <Input
                  id="organization_code"
                  name="organization_code"
                  value={formData.organization_code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="organization_type">Qurum növü</Label>
                <select
                  id="organization_type"
                  name="organization_type"
                  value={formData.organization_type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="PRIVATE">Özəl</option>
                  <option value="STATE">Dövlət</option>
                  <option value="MILITARY">Hərbi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#124459] border-b pb-2">Profil məlumatları</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalName">Hüquqi adı</Label>
                <Input
                  id="legalName"
                  name="legalName"
                  value={formData.organization_profile.legalName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Qeydiyyat nömrəsi</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.organization_profile.registrationNumber}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Ölkə</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.organization_profile.country}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Ünvan</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.organization_profile.address}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#124459] border-b pb-2">Aktiv modullar</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="dashboard"
                  checked={formData.features.dashboard}
                  onChange={handleFeatureToggle}
                />
                Dashboard
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="hrm"
                  checked={formData.features.hrm}
                  onChange={handleFeatureToggle}
                />
                HRM
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="payroll"
                  checked={formData.features.payroll}
                  onChange={handleFeatureToggle}
                />
                Payroll
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="performance"
                  checked={formData.features.performance}
                  onChange={handleFeatureToggle}
                />
                Performance
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="attendance"
                  checked={formData.features.attendance}
                  onChange={handleFeatureToggle}
                />
                Attendance
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="clearanceManagement"
                  checked={formData.features.clearanceManagement}
                  onChange={handleFeatureToggle}
                />
                Clearance Management
              </label>
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
};

export default AddNewOrganizations
