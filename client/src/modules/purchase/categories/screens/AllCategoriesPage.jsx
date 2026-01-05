import React, { useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Search, ChevronRight, ChevronDown, Box, Tag, Folder, FolderOpen, Pencil, Move, Save, X, Check, Plus, Trash2 } from "lucide-react";
import { getAllProducts, updateCategory, updateProduct, getAllCategories, getSubCategories } from "../api/categoryApi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

// Extracted ProductRow Component
const ProductRow = ({ 
    product, 
    isExpanded, 
    toggleExpand, 
    editingItem, 
    setEditingItem, 
    handleEditSave, 
    handleEditCancel, 
    handleEditClick, 
    handleMoveClick,
    onRefresh
}) => {
    const isEditing = editingItem?.id === product._id && editingItem?.type === 'product';
    
    // Spec Editing State
    const [specs, setSpecs] = useState(product.specifications || []);
    const [editingSpecIndex, setEditingSpecIndex] = useState(-1); // -1 means none
    const [tempSpec, setTempSpec] = useState({ key: "", value: "" });
    const [isAddingSpec, setIsAddingSpec] = useState(false);
    const [newSpec, setNewSpec] = useState({ key: "", value: "" });

    useEffect(() => {
        setSpecs(product.specifications || []);
    }, [product.specifications]);

    const handleSpecUpdate = async (updatedSpecs) => {
        try {
            await updateProduct(product._id, { specifications: updatedSpecs });
            toast.success("Spesifikasyonlar yeniləndi");
            onRefresh();
            setEditingSpecIndex(-1);
            setIsAddingSpec(false);
            setNewSpec({ key: "", value: "" });
        } catch (error) {
            toast.error("Xəta baş verdi");
        }
    };

    const startEditSpec = (index, spec) => {
        setEditingSpecIndex(index);
        setTempSpec({ ...spec });
    };

    const cancelEditSpec = () => {
        setEditingSpecIndex(-1);
        setTempSpec({ key: "", value: "" });
    };

    const saveEditSpec = () => {
        if (!tempSpec.key.trim()) {
            toast.error("Açar söz boş ola bilməz");
            return;
        }
        const newSpecs = [...specs];
        newSpecs[editingSpecIndex] = tempSpec;
        handleSpecUpdate(newSpecs);
    };

    const deleteSpec = (index) => {
        if (window.confirm("Bu spesifikasyonu silmək istədiyinizə əminsiniz?")) {
            const newSpecs = specs.filter((_, i) => i !== index);
            handleSpecUpdate(newSpecs);
        }
    };

    const saveNewSpec = () => {
        if (!newSpec.key.trim()) {
            toast.error("Açar söz boş ola bilməz");
            return;
        }
        const newSpecs = [...specs, newSpec];
        handleSpecUpdate(newSpecs);
    };

    return (
        <>
            <TableRow className="group hover:bg-[#F7FAFF] border-b border-[#124459]/10 transition-colors">
                <TableCell className="px-4 py-3 pl-10 w-full">
                    <div className="flex items-center gap-2">
                        <Box className="size-4 text-[#124459]/70 shrink-0" />
                        
                        {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                                <Input 
                                    value={editingItem.name} 
                                    onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                                    className="h-8 text-sm"
                                    autoFocus
                                />
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={handleEditSave}>
                                    <Check className="size-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={handleEditCancel}>
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <span className="font-medium text-[#124459]">{product.name}</span>
                        )}
                    </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#124459]" onClick={() => handleEditClick(product, 'product')}>
                            <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#124459]" onClick={() => handleMoveClick(product, 'product')}>
                            <Move className="size-3.5" />
                        </Button>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleExpand(product._id)}
                            className={isExpanded ? "bg-slate-100 text-slate-900 h-8" : "text-slate-500 hover:text-slate-900 h-8"}
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronDown className="size-4 mr-1" />
                                    Gizlət
                                </>
                            ) : (
                                <>
                                    <ChevronRight className="size-4 mr-1" />
                                    Göstər
                                </>
                            )}
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={2} className="bg-[#FBFDFF] p-0">
                        <div className="p-4 border-t border-b border-slate-100 shadow-inner">
                             <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
                                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                                    <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">Məhsul Xüsusiyyətləri</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{specs.length} xüsusiyyət</span>
                                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setIsAddingSpec(true)} disabled={isAddingSpec}>
                                            <Plus className="size-3" /> Əlavə et
                                        </Button>
                                    </div>
                                </div>
                                
                                <Table className="text-sm">
                                    <TableBody>
                                        {/* Existing Specs */}
                                        {specs.map((spec, index) => {
                                            const isEditingSpec = editingSpecIndex === index;
                                            return (
                                                <TableRow key={index} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 group/spec">
                                                    <TableCell className="w-1/3 font-medium text-slate-600 bg-slate-50/50 px-4 py-2 border-r border-slate-100">
                                                        {isEditingSpec ? (
                                                            <Input 
                                                                value={tempSpec.key}
                                                                onChange={(e) => setTempSpec(prev => ({ ...prev, key: e.target.value }))}
                                                                className="h-7 text-sm"
                                                                placeholder="Açar söz"
                                                            />
                                                        ) : spec.key}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2 text-slate-800">
                                                        {isEditingSpec ? (
                                                            <div className="flex items-center gap-2">
                                                                <Input 
                                                                    value={tempSpec.value}
                                                                    onChange={(e) => setTempSpec(prev => ({ ...prev, value: e.target.value }))}
                                                                    className="h-7 text-sm flex-1"
                                                                    placeholder="Dəyər"
                                                                />
                                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={saveEditSpec}>
                                                                    <Check className="size-3" />
                                                                </Button>
                                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={cancelEditSpec}>
                                                                    <X className="size-3" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between">
                                                                <span>{spec.value || <span className="text-slate-300 italic">Dəyər yoxdur</span>}</span>
                                                                <div className="opacity-0 group-hover/spec:opacity-100 transition-opacity flex items-center gap-1">
                                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-blue-600" onClick={() => startEditSpec(index, spec)}>
                                                                        <Pencil className="size-3" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-600" onClick={() => deleteSpec(index)}>
                                                                        <Trash2 className="size-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {/* New Spec Row */}
                                        {isAddingSpec && (
                                            <TableRow className="bg-blue-50/50 border-b border-slate-100">
                                                <TableCell className="w-1/3 font-medium text-slate-600 px-4 py-2 border-r border-slate-100">
                                                    <Input 
                                                        value={newSpec.key}
                                                        onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                                                        className="h-7 text-sm"
                                                        placeholder="Yeni açar söz"
                                                        autoFocus
                                                    />
                                                </TableCell>
                                                <TableCell className="px-4 py-2 text-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <Input 
                                                            value={newSpec.value}
                                                            onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                                                            className="h-7 text-sm flex-1"
                                                            placeholder="Yeni dəyər"
                                                        />
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={saveNewSpec}>
                                                            <Check className="size-3" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => setIsAddingSpec(false)}>
                                                            <X className="size-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        
                                        {!isAddingSpec && specs.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="p-8 text-center text-slate-400 text-sm">
                                                    Bu məhsul üçün heç bir spesifikasyon tapılmadı.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

const AllCategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  // Editing States
  const [editingItem, setEditingItem] = useState(null); // { id, type: 'category' | 'product', name, parentId, currentParentName }
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [moveItem, setMoveItem] = useState(null); // { id, type: 'category' | 'product', currentParentId }
  const [targetParentId, setTargetParentId] = useState("");

  // Move Dialog Data
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error?.response?.data?.message || "Məhsullar yüklənərkən xəta baş verdi";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Edit Handlers ---

  const handleEditClick = (item, type) => {
    setEditingItem({
        id: item._id,
        type: type,
        name: item.name
    });
  };

  const handleEditCancel = () => {
    setEditingItem(null);
  };

  const handleEditSave = async () => {
    if (!editingItem || !editingItem.name.trim()) return;

    try {
        if (editingItem.type === 'category') {
            await updateCategory(editingItem.id, { name: editingItem.name });
            toast.success("Kateqoriya adı yeniləndi");
        } else {
            await updateProduct(editingItem.id, { name: editingItem.name });
            toast.success("Məhsul adı yeniləndi");
        }
        setEditingItem(null);
        fetchData(); // Refresh data
    } catch (error) {
        toast.error("Yeniləmə zamanı xəta baş verdi");
    }
  };

  // --- Move Handlers ---

  const handleMoveClick = async (item, type, currentParentId) => {
    setMoveItem({ id: item._id, type, currentParentId });
    setMoveDialogOpen(true);
    setTargetParentId("");

    try {
        if (type === 'product') {
            // For products, we need all categories (main + sub)
            // But flattening them might be better handled by fetching main categories and their subs
            // For simplicity, let's fetch main categories first
            const mainCats = await getAllCategories();
            
            // We need a flat list for the select: "Main Cat", "Main Cat > Sub Cat"
            let options = [];
            for (const cat of mainCats) {
                options.push({ id: cat._id, name: cat.name, isGroup: true }); // Main category as option
                const subs = await getSubCategories(cat._id);
                for (const sub of subs) {
                    options.push({ id: sub._id, name: `${cat.name} > ${sub.name}`, isGroup: false });
                }
            }
            setAvailableCategories(options);

        } else if (type === 'category') {
            // For sub-categories (which we are moving), target is a Main Category
            const mainCats = await getAllCategories();
            
            let options = [];
            // Add option to make it a main category (remove parent)
            options.push({ id: 'root', name: 'Ana Kateqoriya (Valideyn yoxdur)' });
            
            // Add existing main categories as potential parents
            mainCats.forEach(c => {
                options.push({ id: c._id, name: c.name });
            });
            
            setAvailableCategories(options);
        }
    } catch (error) {
        toast.error("Kateqoriyalar yüklənərkən xəta baş verdi");
    }
  };

  const handleMoveSave = async () => {
      if (!moveItem || !targetParentId) return;

      try {
          if (moveItem.type === 'product') {
              // Move product to new category
              await updateProduct(moveItem.id, { category: targetParentId });
              toast.success("Məhsulun yeri dəyişdirildi");
          } else if (moveItem.type === 'category') {
              // Move sub-category to new parent or make it main
              const payload = targetParentId === 'root' ? { parent: null } : { parent: targetParentId };
              await updateCategory(moveItem.id, payload);
              toast.success("Kateqoriyanın yeri dəyişdirildi");
          }
          setMoveDialogOpen(false);
          setMoveItem(null);
          fetchData();
      } catch (error) {
          toast.error("Dəyişiklik zamanı xəta baş verdi");
      }
  };


  // Grouping Logic
  const groupedData = useMemo(() => {
    const term = search.trim().toLowerCase();
    
    // 1. Filter products first
    const filteredProducts = products.filter((p) => {
      if (!term) return true;
      const productName = (p.name || "").toLowerCase();
      const catName = (p.category?.name || "").toLowerCase();
      const parentName = (p.category?.parent?.name || "").toLowerCase();
      return productName.includes(term) || catName.includes(term) || parentName.includes(term);
    });

    // 2. Group by Main Category -> Sub Category
    const groups = {};

    filteredProducts.forEach(product => {
      let mainCat = product.category?.parent || product.category;
      let subCat = product.category?.parent ? product.category : null;

      // Safe check if category is completely missing (should not happen in healthy db)
      if (!mainCat) {
        mainCat = { _id: "uncategorized", name: "Digər" };
      }

      const mainId = mainCat._id;
      if (!groups[mainId]) {
        groups[mainId] = {
          info: mainCat,
          subCategories: {},
          directProducts: [] // Products directly under main category (no sub)
        };
      }

      if (subCat) {
        const subId = subCat._id;
        if (!groups[mainId].subCategories[subId]) {
          groups[mainId].subCategories[subId] = {
            info: subCat,
            products: []
          };
        }
        groups[mainId].subCategories[subId].products.push(product);
      } else {
        groups[mainId].directProducts.push(product);
      }
    });

    // Convert to array for rendering and sort by name
    return Object.values(groups).sort((a, b) => a.info.name.localeCompare(b.info.name)).map(group => ({
        ...group,
        subCategories: Object.values(group.subCategories).sort((a, b) => a.info.name.localeCompare(b.info.name))
    }));
  }, [products, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[#124459]">Bütün kateqoriya və məhsullar</h1>
          <p className="text-sm text-[#124459]/70">Sistemdə qeydiyyatda olan bütün kateqoriya və məhsulların siyahısı</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#124459]/50" />
          <input
            className="h-10 w-full rounded-md border border-[#124459]/20 bg-white pl-10 pr-3 text-sm outline-none ring-0 focus:border-[#124459]/40"
            placeholder="Axtarış..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(18,69,89,0.05)] ring-1 ring-[#124459]/10">
        <Table className="text-[13px]">
          <TableHeader>
            <TableRow className="sticky top-0 bg-white">
              <TableHead className="w-[70%]">Ad</TableHead>
              <TableHead className="text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-10 text-gray-500">Yüklənir...</TableCell>
              </TableRow>
            ) : groupedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-10 text-gray-500">Məhsul tapılmadı</TableCell>
              </TableRow>
            ) : (
                groupedData.map(mainGroup => {
                    const isMainExpanded = expandedItems[mainGroup.info._id];
                    const isEditingMain = editingItem?.id === mainGroup.info._id && editingItem?.type === 'category';
                    
                    return (
                        <React.Fragment key={mainGroup.info._id}>
                            {/* Main Category Row */}
                            <TableRow 
                                className="bg-slate-50 hover:bg-slate-100 cursor-pointer border-b border-[#124459]/10 group"
                            >
                                <TableCell className="px-4 py-3" onClick={() => !isEditingMain && toggleExpand(mainGroup.info._id)}>
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-full bg-blue-100 text-blue-700 grid place-items-center ring-1 ring-blue-200 shrink-0">
                                            {isMainExpanded ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}
                                        </div>
                                        
                                        {isEditingMain ? (
                                            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                                <Input 
                                                    value={editingItem.name} 
                                                    onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                                                    className="h-8 text-sm"
                                                    autoFocus
                                                />
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={handleEditSave}>
                                                    <Check className="size-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={handleEditCancel}>
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="font-semibold text-[#124459] text-sm">{mainGroup.info.name}</span>
                                                <span className="text-xs text-slate-400 ml-2">
                                                    ({mainGroup.subCategories.reduce((acc, sub) => acc + sub.products.length, 0) + mainGroup.directProducts.length} məhsul)
                                                </span>
                                            </>
                                        )}
                                        
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#124459]" onClick={(e) => { e.stopPropagation(); handleEditClick(mainGroup.info, 'category'); }}>
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            {/* Main categories usually don't move unless we implement parent change for them too, keeping it simple for now or adding if needed */}
                                        </div>
                                        {isMainExpanded ? <ChevronDown className="size-4 text-slate-400" /> : <ChevronRight className="size-4 text-slate-400" />}
                                    </div>
                                </TableCell>
                            </TableRow>

                            {/* Main Category Content */}
                            {isMainExpanded && (
                                <>
                                    {/* Direct Products under Main Category */}
                                    {mainGroup.directProducts.map(product => (
                                        <ProductRow 
                                            key={product._id} 
                                            product={product} 
                                            isExpanded={expandedItems[product._id]}
                                            toggleExpand={toggleExpand}
                                            editingItem={editingItem}
                                            setEditingItem={setEditingItem}
                                            handleEditSave={handleEditSave}
                                            handleEditCancel={handleEditCancel}
                                            handleEditClick={handleEditClick}
                                            handleMoveClick={handleMoveClick}
                                            onRefresh={fetchData}
                                        />
                                    ))}

                                    {/* Sub Categories */}
                                    {mainGroup.subCategories.map(subGroup => {
                                        const isSubExpanded = expandedItems[subGroup.info._id];
                                        const isEditingSub = editingItem?.id === subGroup.info._id && editingItem?.type === 'category';

                                        return (
                                            <React.Fragment key={subGroup.info._id}>
                                                {/* Sub Category Row */}
                                                <TableRow 
                                                    className="bg-white hover:bg-slate-50 cursor-pointer border-b border-slate-100 group"
                                                >
                                                    <TableCell className="px-4 py-2 pl-8" onClick={() => !isEditingSub && toggleExpand(subGroup.info._id)}>
                                                        <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
                                                            <div className="size-6 rounded-full bg-slate-100 text-slate-600 grid place-items-center shrink-0">
                                                                <Tag className="size-3" />
                                                            </div>
                                                            
                                                            {isEditingSub ? (
                                                                <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                                                    <Input 
                                                                        value={editingItem.name} 
                                                                        onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                                                                        className="h-8 text-sm"
                                                                        autoFocus
                                                                    />
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={handleEditSave}>
                                                                        <Check className="size-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={handleEditCancel}>
                                                                        <X className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <span className="font-medium text-slate-700">{subGroup.info.name}</span>
                                                                    <span className="text-xs text-slate-400 ml-1">({subGroup.products.length})</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#124459]" onClick={(e) => { e.stopPropagation(); handleEditClick(subGroup.info, 'category'); }}>
                                                                    <Pencil className="size-3.5" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#124459]" onClick={(e) => { e.stopPropagation(); handleMoveClick(subGroup.info, 'category'); }}>
                                                                    <Move className="size-3.5" />
                                                                </Button>
                                                            </div>
                                                            {isSubExpanded ? <ChevronDown className="size-3 text-slate-300" /> : <ChevronRight className="size-3 text-slate-300" />}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Sub Category Products */}
                                                {isSubExpanded && subGroup.products.map(product => (
                                                     <ProductRow 
                                                        key={product._id} 
                                                        product={product} 
                                                        isExpanded={expandedItems[product._id]}
                                                        toggleExpand={toggleExpand}
                                                        editingItem={editingItem}
                                                        setEditingItem={setEditingItem}
                                                        handleEditSave={handleEditSave}
                                                        handleEditCancel={handleEditCancel}
                                                        handleEditClick={handleEditClick}
                                                        handleMoveClick={handleMoveClick}
                                                        onRefresh={fetchData}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </>
                            )}
                        </React.Fragment>
                    );
                })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Move Dialog */}
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Yerdəyişmə</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label>Yeni Kateqoriya / Valideyn Seçin</Label>
                    <Select value={targetParentId} onValueChange={setTargetParentId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seçin..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {availableCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id} disabled={cat.id === moveItem?.id || cat.id === moveItem?.currentParentId}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>Ləğv et</Button>
                <Button onClick={handleMoveSave}>Yadda saxla</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCategoriesPage;