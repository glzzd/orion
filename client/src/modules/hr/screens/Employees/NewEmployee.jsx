import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  FileText,
  Save,
  Upload,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  X,
  CreditCard,
  Building,
  BadgeCheck,
  GraduationCap,
  History,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import documentTypes from "@/consts/documentTypes.json";

const NewEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    phone: "",
    residentialAddress: "",
    registrationAddress: "",
    maritalStatus: "Subay",
    finCode: "",
    idSeriesNum: "",
    photo: null,
    
    // Step 1: Documents (Dynamic)
    documents: [], // { id, type, file }

    // Step 2: Education
    education: [], // { id, institution, degree, startDate, endDate }
    educationDocuments: [],

    // Step 3: Work Experience
    workExperience: [], // { id, company, position, startDate, endDate, description }
    laborBook: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  // Document Handlers
  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { id: Date.now(), type: "", file: null }]
    }));
  };

  const updateDocument = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeDocument = (id) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(item => item.id !== id)
    }));
  };

  // Education Handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), institution: "", degree: "", startDate: "", endDate: "" }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { id: Date.now(), company: "", position: "", startDate: "", endDate: "", description: "" }]
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      navigate("/hr/employees");
    }, 1500);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Components
  const SectionTitle = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4 mb-6 pb-4 border-b border-[#E5E7EB]">
      <div className="p-3 rounded-xl bg-[#F3F4F6] text-[#124459] ring-1 ring-[#E5E7EB]">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#124459]">{title}</h3>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </div>
    </div>
  );

  const InputGroup = ({ label, name, type = "text", placeholder, icon: Icon, value, onChange, options, required = false }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#374151] ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#124459] transition-colors">
            <Icon size={18} />
          </div>
        )}
        {options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full bg-white border border-[#D1D5DB] rounded-xl py-2.5 ${Icon ? "pl-10" : "pl-4"} pr-4 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#124459]/10 focus:border-[#124459] transition-all appearance-none cursor-pointer shadow-sm`}
          >
            <option value="" disabled>Seçin...</option>
            {options.map((opt) => (
               // Handle both string array and object array for options
              <option key={typeof opt === 'object' ? opt.id : opt} value={typeof opt === 'object' ? opt.id : opt} className="text-[#111827]">
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-white border border-[#D1D5DB] rounded-xl py-2.5 ${Icon ? "pl-10" : "pl-4"} pr-4 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#124459]/10 focus:border-[#124459] transition-all shadow-sm`}
          />
        )}
      </div>
    </div>
  );

  const FileUpload = ({ label, description, onChange, icon: Icon = FileText }) => (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm h-full justify-center">
      <div className="w-16 h-16 rounded-full bg-[#F3F4F6] border-2 border-dashed border-[#D1D5DB] flex items-center justify-center mb-4 group cursor-pointer hover:border-[#124459]/50 transition-all relative overflow-hidden">
        <Icon size={24} className="text-[#9CA3AF] group-hover:text-[#124459] transition-colors" />
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => onChange(e.target.files[0])}
        />
      </div>
      <h3 className="text-[#124459] font-medium mb-1">{label}</h3>
      <p className="text-xs text-[#6B7280]">{description}</p>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        { step: 1, title: "Şəxsi Məlumatlar", icon: User },
        { step: 2, title: "Təhsil", icon: GraduationCap },
        { step: 3, title: "İş Təcrübəsi", icon: History }
      ].map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className={`flex flex-col items-center gap-2 ${currentStep >= item.step ? "text-[#124459]" : "text-[#9CA3AF]"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep >= item.step 
                ? "bg-[#124459] border-[#124459] text-white" 
                : "bg-white border-[#E5E7EB] text-[#9CA3AF]"
            }`}>
              <item.icon size={18} />
            </div>
            <span className="text-xs font-medium">{item.title}</span>
          </div>
          {index < 2 && (
            <div className={`w-20 h-0.5 mx-4 mb-6 ${currentStep > item.step ? "bg-[#124459]" : "bg-[#E5E7EB]"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-6 px-6 relative overflow-hidden">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-[#124459]/10 text-[#124459]/60 hover:text-[#124459] hover:bg-[#124459]/5 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#124459] tracking-tight">Yeni Əməkdaş</h1>
            <p className="text-[#124459]/60 text-sm">Sistemə yeni işçi əlavə edin</p>
          </div>
        </div>
      </div>

      <StepIndicator />

      {/* Main Form */}
      <div className="max-w-4xl mx-auto relative z-10 pb-24">
        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
                <SectionTitle 
                  icon={User} 
                  title="Şəxsi Məlumatlar" 
                  description="Sistemə əlavə ediləcək əməkdaşın şəxsi məlumatları" 
                />
                
                <div className="grid grid-cols-12 gap-6">
                  {/* Photo Upload - Left Side */}
                  <div className="col-span-12 md:col-span-3">
                     <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[#F3F4F6] border-2 border-dashed border-[#D1D5DB] flex items-center justify-center mb-3 relative overflow-hidden group">
                          {formData.photo ? (
                             <img src={URL.createObjectURL(formData.photo)} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                             <User size={32} className="text-[#9CA3AF]" />
                          )}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange("photo", e.target.files[0])} />
                        </div>
                        <p className="text-xs text-[#6B7280]">Əməkdaşın şəkli</p>
                     </div>
                  </div>

                  {/* Basic Info - Right Side */}
                  <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Ad" name="firstName" placeholder="Əməkdaşın adı" value={formData.firstName} onChange={handleInputChange} />
                    <InputGroup label="Soyad" name="lastName" placeholder="Əməkdaşın soyadı" value={formData.lastName} onChange={handleInputChange} />
                    <InputGroup label="Ata adı" name="fatherName" placeholder="Əməkdaşın ata adı" value={formData.fatherName} onChange={handleInputChange} />
                    <InputGroup label="Ş/V FİN kodu" name="finCode" placeholder="Əməkdaşın FİN kodu" value={formData.finCode} onChange={handleInputChange} />
                    <InputGroup label="Ş/V seriya və nömrəsi" name="idSeriesNum" placeholder="AZE 12345678" value={formData.idSeriesNum} onChange={handleInputChange} />
                    <InputGroup label="Evlilik vəziyyəti" name="maritalStatus" options={["Subay", "Evli", "Boşanmış", "Dul"]} value={formData.maritalStatus} onChange={handleInputChange} />
                  </div>

                  <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="E-poçt" name="email" placeholder="Əməkdaşın e-poçt ünvanı" type="email" icon={Mail} value={formData.email} onChange={handleInputChange} />
                    <InputGroup label="Telefon" name="phone" type="tel" placeholder="Əməkdaşın mobil nömrəsi" icon={Phone} value={formData.phone} onChange={handleInputChange} />
                    <InputGroup label="Yaşayış Ünvanı" placeholder="Əməkdaşın faktiki yaşadığı ünvan" name="residentialAddress" icon={MapPin} value={formData.residentialAddress} onChange={handleInputChange} />
                    <InputGroup label="Qeydiyyat Ünvanı" placeholder="Əməkdaşın qeydiyyat ünvanı" name="registrationAddress" icon={MapPin} value={formData.registrationAddress} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Dynamic Documents Section */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
                   <SectionTitle 
                    icon={FileText} 
                    title="Sənədlər" 
                    description="Şəxsiyyət vəsiqəsi, pasport və digər sənədlər" 
                  />
                  <button type="button" onClick={addDocument} className="flex items-center gap-2 text-sm font-medium text-[#124459] bg-[#F3F4F6] px-4 py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors">
                    <Plus size={16} /> Sənəd Əlavə et
                  </button>
                </div>
                
                {formData.documents.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">
                      Heç bir sənəd əlavə edilməyib. "Sənəd Əlavə et" düyməsini sıxın.
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.documents.map((doc, index) => (
                      <div key={doc.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] relative group">
                        <button type="button" onClick={() => removeDocument(doc.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded z-10">
                          <Trash2 size={18} />
                        </button>
                        
                        <div className="flex flex-col gap-4">
                           <InputGroup 
                            label={`Sənəd #${index + 1}`}
                            name={`doc-type-${doc.id}`}
                            value={doc.type} 
                            onChange={(e) => updateDocument(doc.id, "type", e.target.value)} 
                            options={documentTypes} // Pass the imported JSON array directly
                            placeholder="Sənəd növünü seçin"
                          />
                          
                          <div className="h-40">
                             <FileUpload 
                                label={doc.file ? doc.file.name : "Fayl seçin"}
                                description={doc.file ? `${(doc.file.size / 1024 / 1024).toFixed(2)} MB` : "PDF və ya JPG (max 5MB)"}
                                onChange={(f) => updateDocument(doc.id, "file", f)} 
                                icon={doc.file ? CheckCircle : Upload}
                              />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
                   <SectionTitle 
                    icon={GraduationCap} 
                    title="Təhsil Məlumatları" 
                    description="Universitet, məktəb və digər təhsil qurumları" 
                  />
                  <button type="button" onClick={addEducation} className="flex items-center gap-2 text-sm font-medium text-[#124459] bg-[#F3F4F6] px-4 py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors">
                    <Plus size={16} /> Əlavə et
                  </button>
                </div>
                
                {formData.education.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">
                      Heç bir təhsil məlumatı əlavə edilməyib.
                   </div>
                ) : (
                  <div className="space-y-6">
                    {formData.education.map((edu, index) => (
                      <div key={edu.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] relative group">
                        <button type="button" onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                          <Trash2 size={18} />
                        </button>
                        <h4 className="font-medium text-[#124459] mb-4">Təhsil #{index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputGroup 
                            label="Təhsil Müəssisəsi" 
                            value={edu.institution} 
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} 
                            placeholder="Universitet və ya məktəb adı"
                          />
                          <InputGroup 
                            label="İxtisas / Dərəcə" 
                            value={edu.degree} 
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} 
                            placeholder="Məs: Kompüter Mühəndisliyi"
                          />
                          <InputGroup 
                            label="Başlama Tarixi" 
                            type="date"
                            value={edu.startDate} 
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} 
                          />
                          <InputGroup 
                            label="Bitmə Tarixi" 
                            type="date"
                            value={edu.endDate} 
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
                <SectionTitle 
                  icon={FileText} 
                  title="Təhsil Sənədləri" 
                  description="Diplom, sertifikat və attestat surətləri" 
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FileUpload 
                    label="Diplom" 
                    description="PDF və ya JPG (max 5MB)" 
                    onChange={(f) => {}} 
                  />
                  <FileUpload 
                    label="Sertifikatlar" 
                    description="Zip və ya PDF formatında" 
                    onChange={(f) => {}} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Work Experience */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
                   <SectionTitle 
                    icon={Briefcase} 
                    title="İş Təcrübəsi" 
                    description="Əvvəlki iş yerləri və vəzifələr" 
                  />
                  <button type="button" onClick={addExperience} className="flex items-center gap-2 text-sm font-medium text-[#124459] bg-[#F3F4F6] px-4 py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors">
                    <Plus size={16} /> Əlavə et
                  </button>
                </div>
                
                {formData.workExperience.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">
                      Heç bir iş təcrübəsi əlavə edilməyib.
                   </div>
                ) : (
                  <div className="space-y-6">
                    {formData.workExperience.map((exp, index) => (
                      <div key={exp.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] relative group">
                         <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                          <Trash2 size={18} />
                        </button>
                        <h4 className="font-medium text-[#124459] mb-4">İş Yeri #{index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputGroup 
                            label="Şirkət Adı" 
                            value={exp.company} 
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)} 
                          />
                          <InputGroup 
                            label="Vəzifə" 
                            value={exp.position} 
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)} 
                          />
                          <InputGroup 
                            label="Başlama Tarixi" 
                            type="date"
                            value={exp.startDate} 
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} 
                          />
                          <InputGroup 
                            label="Bitmə Tarixi" 
                            type="date"
                            value={exp.endDate} 
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} 
                          />
                          <div className="md:col-span-2">
                             <InputGroup 
                              label="İşin Təsviri" 
                              value={exp.description} 
                              onChange={(e) => updateExperience(exp.id, "description", e.target.value)} 
                              placeholder="Vəzifə öhdəlikləri haqqında qısa məlumat..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

               <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-sm">
                <SectionTitle 
                  icon={FileText} 
                  title="Əmək Kitabçası" 
                  description="Əmək kitabçasının surəti" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload 
                    label="Əmək Kitabçası" 
                    description="Bütün səhifələr (PDF)" 
                    onChange={(f) => handleFileChange("laborBook", f)} 
                    icon={Briefcase}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={currentStep === 1 ? () => navigate(-1) : prevStep}
                className="px-6 py-2.5 rounded-xl border border-[#D1D5DB] text-[#374151] font-medium hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
              >
                {currentStep === 1 ? "Ləğv et" : (
                  <>
                    <ChevronLeft size={18} /> Geri
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-3">
                 {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2.5 rounded-xl bg-[#124459] text-white font-medium hover:bg-[#0f2a3a] transition-colors flex items-center gap-2"
                    >
                      Növbəti <ChevronRight size={18} />
                    </button>
                 ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-[#124459] text-white font-medium hover:bg-[#0f2a3a] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Yadda saxlanılır...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Yadda saxla
                        </>
                      )}
                    </button>
                 )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmployee;
