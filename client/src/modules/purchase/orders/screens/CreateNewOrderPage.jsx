import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAllCategories, getSubCategories, getProductsByCategory } from "../../categories/api/categoryApi";

const CreateNewOrderPage = () => {
  const navigate = useNavigate();
  
  // Data States
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Selection States
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Loading States
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Initial Load - Get Main Categories
  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      setLoadingMain(true);
      const data = await getAllCategories();
      setMainCategories(data || []);
    } catch (error) {
      toast.error("Kateqoriyalar yüklənərkən xəta baş verdi");
    } finally {
      setLoadingMain(false);
    }
  };

  // Handle Main Category Change
  const handleMainCategoryChange = async (value) => {
    setSelectedMainCategory(value);
    setSelectedSubCategory("");
    setSelectedProduct("");
    setSelectedProductDetails(null);
    setSubCategories([]);
    setProducts([]);

    if (value) {
      try {
        setLoadingSub(true);
        const data = await getSubCategories(value);
        setSubCategories(data || []);
      } catch (error) {
        toast.error("Alt kateqoriyalar yüklənərkən xəta baş verdi");
      } finally {
        setLoadingSub(false);
      }
    }
  };

  // Handle Sub Category Change
  const handleSubCategoryChange = async (value) => {
    setSelectedSubCategory(value);
    setSelectedProduct("");
    setSelectedProductDetails(null);
    setProducts([]);

    if (value) {
      try {
        setLoadingProducts(true);
        const data = await getProductsByCategory(value);
        setProducts(data || []);
      } catch (error) {
        toast.error("Məhsullar yüklənərkən xəta baş verdi");
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  // Handle Product Change
  const handleProductChange = (value) => {
    setSelectedProduct(value);
    const product = products.find(p => p._id === value);
    setSelectedProductDetails(product || null);
  };

  const selectors = [
    {
      id: "main",
      label: "Ana Kateqoriya",
      value: selectedMainCategory,
      options: mainCategories,
      onChange: handleMainCategoryChange,
      loading: loadingMain,
      disabled: loadingMain,
      placeholder: "Ana kateqoriya seçin"
    },
    {
      id: "sub",
      label: "Alt Kateqoriya",
      value: selectedSubCategory,
      options: subCategories,
      onChange: handleSubCategoryChange,
      loading: loadingSub,
      disabled: !selectedMainCategory || loadingSub,
      placeholder: "Alt kateqoriya seçin",
      emptyMsg: "Bu kateqoriyada alt kateqoriya yoxdur."
    },
    {
      id: "product",
      label: "Məhsul",
      value: selectedProduct,
      options: products,
      onChange: handleProductChange,
      loading: loadingProducts,
      disabled: !selectedSubCategory || loadingProducts,
      placeholder: "Məhsul seçin",
      emptyMsg: "Bu kateqoriyada məhsul yoxdur."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-[#124459]" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Yeni Sifariş</h1>
          <p className="text-sm text-[#124459]/70">Yeni satınalma sifarişi yaradın</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Selection Area */}
        <Card className="rounded-3xl bg-white shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 border-none">
          <CardHeader>
            <CardTitle>Məhsul Seçimi</CardTitle>
            <CardDescription>
              Sifariş etmək istədiyiniz məhsulu kateqoriyalara görə seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectors.map((selector) => (
              <div key={selector.id} className="space-y-2">
                <Label>{selector.label}</Label>
                <Select 
                  value={selector.value} 
                  onValueChange={selector.onChange}
                  disabled={selector.disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selector.loading ? "Yüklənir..." : selector.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {selector.options.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selector.emptyMsg && selector.options.length === 0 && !selector.loading && !selector.disabled && selector.value !== "" && (
                   <p className="text-xs text-yellow-600">{selector.emptyMsg}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Product Specifications Display */}
        {selectedProductDetails && (
          <Card className="rounded-3xl bg-white shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10 border-none animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-[#124459]">{selectedProductDetails.name}</span>
                <span className="text-sm font-normal text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
                  {selectedProductDetails.unit}
                </span>
              </CardTitle>
              <CardDescription>
                Məhsul xüsusiyyətləri və detalları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProductDetails.description && (
                  <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                    {selectedProductDetails.description}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-3 text-slate-900">Spesifikasyonlar</h4>
                  {selectedProductDetails.specifications && selectedProductDetails.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProductDetails.specifications.map((spec, index) => (
                        <div key={index} className="flex flex-col p-2 border border-slate-100 rounded-md bg-white">
                          <span className="text-xs text-slate-400 uppercase tracking-wider">{spec.key}</span>
                          <span className="text-sm font-medium text-slate-700">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Heç bir xüsusi spesifikasiya qeyd olunmayıb.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
              <Button className="bg-[#124459] hover:bg-[#0e3647] w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Sifarişə Əlavə Et
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateNewOrderPage;
