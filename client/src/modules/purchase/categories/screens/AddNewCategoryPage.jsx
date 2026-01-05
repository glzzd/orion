import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory, getAllCategories } from "../api/categoryApi";

const AddNewCategoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    parent: "none" // "none" means main category
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setFetching(true);
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error("Kateqoriyalar yüklənərkən xəta baş verdi");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Kateqoriya adı mütləqdir");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        parent: formData.parent === "none" ? null : formData.parent
      };

      await createCategory(payload);
      toast.success("Kateqoriya uğurla yaradıldı");
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
          <h1 className="text-2xl font-semibold text-[#124459]">Yeni Kateqoriya</h1>
          <p className="text-sm text-[#124459]/70">Yeni məhsul kateqoriyası yaradın</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="rounded-3xl bg-white shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 border-none">
          <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Kateqoriya Məlumatları</CardTitle>
            <CardDescription>
              Zəhmət olmasa kateqoriya adını və varsa üst kateqoriyanı seçin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kateqoriya Adı <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                placeholder="Məsələn: Elektronika, Ofis Ləvazimatları..." 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Üst Kateqoriya (Opsional)</Label>
              <Select 
                value={formData.parent} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, parent: value }))}
                disabled={fetching}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçin..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Ana Kateqoriya --</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Əgər bu bir alt kateqoriyadırsa, üst kateqoriyanı seçin. Əks halda "Ana Kateqoriya" olaraq saxlayın.
              </p>
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
      </div>
    </div>
  );
};

export default AddNewCategoryPage;
