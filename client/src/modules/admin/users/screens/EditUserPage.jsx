import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getUserById, updateUser, getAllRoles } from "../api/userApi";
import { ArrowLeft, Save, Loader2, Eye, EyeOff, RefreshCcw } from "lucide-react";

const EditUserPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tenantParam = searchParams.get("tenantId") || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // Leave empty if not changing
    firstName: "",
    lastName: "",
    fatherName: "",
    gender: "MALE",
    roleId: "",
    status: "ACTIVE"
  });
  const [showPassword, setShowPassword] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setInitialLoading(true);
      const [rolesData, userData] = await Promise.all([
        getAllRoles(tenantParam ? { tenantId: tenantParam } : undefined),
        getUserById(id, tenantParam ? { tenantId: tenantParam } : undefined)
      ]);
      
      setRoles(rolesData || []);

      if (userData) {
        setFormData({
            username: userData.username || "",
            email: userData.email || "",
            password: "", // Don't show hash
            firstName: userData.personalData?.firstName || "",
            lastName: userData.personalData?.lastName || "",
            fatherName: userData.personalData?.fatherName || "",
            gender: userData.personalData?.gender || "MALE",
            roleId: userData.roles?.[0]?.roleId?._id || userData.roles?.[0]?.roleId || "",
            status: userData.status || "ACTIVE"
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Məlumatlar yüklənərkən xəta baş verdi");
      navigate("/admin/users");
    } finally {
      setInitialLoading(false);
    }
  }, [id, tenantParam, navigate]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += charset[Math.floor(Math.random() * charset.length)];
    }
    setFormData((prev) => ({ ...prev, password: pwd }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.roleId) {
        toast.error("Zəhmət olmasa bir rol seçin");
        setLoading(false);
        return;
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        personalData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fatherName: formData.fatherName,
          gender: formData.gender,
        },
        roles: [formData.roleId], // Currently supporting single role selection in UI
        status: formData.status
      };

      // Only add password if it's not empty
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      await updateUser(id, tenantParam ? { ...payload, tenantId: tenantParam } : payload);
      toast.success("İstifadəçi məlumatları yeniləndi");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#124459]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="size-5 text-[#124459]" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#124459]">İstifadəçini redaktə et</h1>
          <p className="text-sm text-[#124459]/70">İstifadəçi məlumatlarını yeniləyin</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">Ata adı</Label>
              <Input
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Cins</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="MALE">Kişi</option>
                <option value="FEMALE">Qadın</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">İstifadəçi adı</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifrə (Dəyişmək istəmirsinizsə boş buraxın)</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-24"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Random password"
                  title="Random şifrə"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleId">Rol</Label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Seçin</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ACTIVE">Aktiv</option>
                <option value="INACTIVE">Deaktiv</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
                type="submit" 
                className="bg-[#124459] text-white hover:bg-[#0f2a3a]"
                disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yadda saxlanılır...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Yadda saxla
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
