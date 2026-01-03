import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getUserById, updateUser, getAllRoles } from "../api/userApi";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const EditUserPage = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [rolesData, userData] = await Promise.all([
        getAllRoles(),
        getUserById(id)
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      await updateUser(id, payload);
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
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
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
