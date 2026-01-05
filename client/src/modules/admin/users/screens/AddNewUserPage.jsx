import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createUser } from "../api/userApi";
import { getAllEmployees, getAllOrganizations, getAllRoles } from "@/modules/hr/api/employeeApi";
import { ArrowLeft, Save, Loader2, Search, X } from "lucide-react";

const AddNewUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [roles, setRoles] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    gender: "MALE",
    roleId: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllOrganizations();
        setOrganizations(data || []);
      } catch { void 0; }
      try {
        const data = await getAllRoles(selectedTenantId);
        setRoles(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, roleId: data[0]._id }));
        }
      } catch {
        toast.error("Rollar yüklənərkən xəta baş verdi");
      }
    })();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedTenantId]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const params = { search: searchTerm, limit: 10 };
        if (selectedTenantId) params.tenantId = selectedTenantId;
        const result = await getAllEmployees(params);
        setEmployeesList(result.data || []);
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedTenantId]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllRoles(selectedTenantId);
        setRoles(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, roleId: data[0]._id }));
        }
      } catch {
        toast.error("Rollar yüklənərkən xəta baş verdi");
      }
    })();
    if (!searchTerm) {
      setEmployeesList([]);
    }
  }, [selectedTenantId, searchTerm]);

  // removed helper functions to satisfy lint

  const handleEmployeeSelect = (emp) => {
    const fullName = `${emp.personalData.firstName} ${emp.personalData.lastName}`;
    setSearchTerm(fullName);
    setIsDropdownOpen(false);

    // Generate suggested username and email
    const suggestedUsername = `${emp.personalData.firstName.toLowerCase()}.${emp.personalData.lastName.toLowerCase()}`;
    // Assuming a default domain, user can change it
    // const suggestedEmail = `${suggestedUsername}@example.com`; 

    setFormData((prev) => ({
      ...prev,
      firstName: emp.personalData.firstName || "",
      lastName: emp.personalData.lastName || "",
      fatherName: emp.personalData.fatherName || "",
      gender: emp.personalData.gender || "MALE",
      // email: suggestedEmail, 
      username: suggestedUsername,
    }));
    toast.info("İşçi məlumatları dolduruldu. Çatışmayan məlumatları yoxlayın.");
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
        password: formData.password,
        personalData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fatherName: formData.fatherName,
          gender: formData.gender,
          nationality: "Azerbaijani", // Default or add field
          citizenship: "Azerbaijani" // Default or add field
        },
        roles: [formData.roleId],
        status: "ACTIVE"
      };

      await createUser(payload);
      toast.success("İstifadəçi uğurla yaradıldı");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="size-5 text-[#124459]" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#124459]">Yeni istifadəçi</h1>
          <p className="text-sm text-[#124459]/70">Sistemə yeni istifadəçi əlavə edin</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
        <div className="mb-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Qurum seçin</Label>
              <select
                id="tenant"
                value={selectedTenantId}
                onChange={(e) => {
                  setSelectedTenantId(e.target.value);
                  setIsDropdownOpen(false);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Cari qurum</option>
                {organizations.map(org => (
                  <option key={org._id} value={org._id}>{org.organization_name}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Super admin üçün digər qurumları seçmək mümkündür.
              </p>
            </div>
            <div className="space-y-2" ref={dropdownRef}>
              <Label>Mövcud işçilərdən seç (Avtomatik doldurma)</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Ad, Soyad və ya Vəzifə üzrə axtarış..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="pl-9"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFormData(prev => ({
                          ...prev,
                          firstName: "",
                          lastName: "",
                          fatherName: "",
                          email: "",
                          username: ""
                        }));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    {employeesList.length > 0 ? (
                      employeesList.map((emp) => (
                        <div
                          key={emp._id}
                          className="cursor-pointer px-4 py-2 hover:bg-slate-50 text-sm"
                          onClick={() => handleEmployeeSelect(emp)}
                        >
                          <div className="font-medium text-[#124459]">
                            {emp.personalData.firstName} {emp.personalData.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {emp.jobData.primaryAssignment.role}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">Nəticə tapılmadı</div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Qeyd: İşçi seçimi formanı avtomatik dolduracaq.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#124459] border-b pb-2">Şəxsi Məlumatlar</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ad daxil edin"
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
                  placeholder="Soyad daxil edin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Ata adı</Label>
                <Input 
                  id="fatherName" 
                  name="fatherName" 
                  value={formData.fatherName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ata adı daxil edin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Cins</Label>
                <select 
                  id="gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="MALE">Kişi</option>
                  <option value="FEMALE">Qadın</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#124459] border-b pb-2">Hesab Məlumatları</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">İstifadəçi adı</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  placeholder="İstifadəçi adı"
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
                  placeholder="Email ünvanı"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifrə</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="Şifrə təyin edin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleId">Rol</Label>
                <select 
                  id="roleId" 
                  name="roleId" 
                  value={formData.roleId} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled>Rol seçin</option>
                  {roles.map(role => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                  ))}
                </select>
              </div>
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

export default AddNewUserPage;
