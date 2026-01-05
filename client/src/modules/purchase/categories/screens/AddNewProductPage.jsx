import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createProduct, getAllCategories, getSubCategories } from "../api/categoryApi";

const AddNewProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "ədəd",
    description: "",
    specifications: []
  });

  // Specifications State
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setFetching(true);
      const mainCats = await getAllCategories();
      let options = [];
      
      for (const cat of mainCats) {
        // Main category
        options.push({ id: cat._id, name: cat.name, isGroup: true });
        
        // Sub categories
        const subs = await getSubCategories(cat._id);
        for (const sub of subs) {
          options.push({ id: sub._id, name: `${cat.name} > ${sub.name}`, isGroup: false });
        }
      }
      
      setCategories(options);
    } catch (error) {
      toast.error("Kateqoriyalar yüklənərkən xəta baş verdi");
    } finally {
      setFetching(false);
    }
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
  };

  const updateSpec = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Məhsul adı mütləqdir");
      return;
    }
    if (!formData.category) {
      toast.error("Kateqoriya seçilməlidir");
      return;
    }

    // Filter empty specs
    const validSpecs = specs.filter(s => s.key.trim() !== "");

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        description: formData.description,
        specifications: validSpecs
      };

      await createProduct(payload);
      toast.success("Məhsul uğurla yaradıldı");
      navigate("/purchase/categories");
    } catch (error) {
      toast.error("Xəta baş verdi: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-[#124459]" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Yeni Məhsul</h1>
          <p className="text-sm text-[#124459]/70">Yeni satınalma məhsulu yaradın</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Main Info */}
        <Card className="md:col-span-2 rounded-3xl bg-white shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 border-none">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Əsas Məlumatlar</CardTitle>
              <CardDescription>
                Məhsulun əsas parametrlərini daxil edin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Məhsul Adı <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Məsələn: A4 Kağız, Qələm..." 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kateqoriya <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={fetching}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Ölçü Vahidi</Label>
                  <Input 
                    id="unit" 
                    placeholder="Məsələn: ədəd, kg, litr" 
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Təsvir</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Məhsul haqqında əlavə məlumat..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t bg-slate-50/50 p-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Ləğv et
              </Button>
              <Button type="submit" disabled={loading || fetching} className="bg-[#124459] hover:bg-[#0e3647]">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Yadda saxla
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Right Side - Specifications */}
        <Card className="h-fit rounded-3xl bg-white shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Xüsusiyyətlər</CardTitle>
            <CardDescription>
              Məhsulun texniki göstəriciləri (Opsional)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-slate-50 border-y border-slate-100 p-2 flex justify-end">
              <Button size="sm" variant="outline" onClick={addSpec} className="h-8 text-xs gap-1">
                <Plus className="h-3 w-3" /> Əlavə et
              </Button>
            </div>
            
            {specs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Xüsusiyyət əlavə edilməyib.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {specs.map((spec, index) => (
                  <div key={index} className="p-3 space-y-2 bg-white hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Açar söz (məs: Rəng)" 
                        className="h-8 text-sm"
                        value={spec.key}
                        onChange={(e) => updateSpec(index, 'key', e.target.value)}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                        onClick={() => removeSpec(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input 
                      placeholder="Dəyər (məs: Qırmızı)" 
                      className="h-8 text-sm"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewProductPage;
