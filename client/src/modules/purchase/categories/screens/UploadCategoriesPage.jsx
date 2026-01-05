import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadCategories } from '../api/categoryApi';
import { toast } from 'sonner';

const UploadCategoriesPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        toast.error("Yalnız Excel faylları (.xlsx, .xls) qəbul edilir.");
        return;
      }
      setFile(selectedFile);
      setStats(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await uploadCategories(file);
      setStats(result.data.stats);
      toast.success("Kateqoriyalar uğurla yükləndi!");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Yükləmə zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kateqoriyaları İmpot Et</h1>
        <p className="text-gray-500 mt-2">Excel faylından kateqoriya, alt kateqoriya və məhsulları toplu şəkildə yükləyin.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
          <input 
            type="file" 
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {file ? (
              <>
                <FileSpreadsheet className="w-16 h-16 text-green-600 mb-4 transition-transform group-hover:scale-110" />
                <p className="text-lg font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mb-4 transition-transform group-hover:scale-110" />
                <p className="text-lg font-medium text-gray-900">Excel faylını bura sürüşdürün və ya seçin</p>
                <p className="text-sm text-gray-500 mt-1">Dəstəklənən formatlar: .xlsx, .xls</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all flex items-center gap-2
              ${!file || loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Yüklənir...
              </>
            ) : (
              <>
                <Upload size={18} />
                Yüklə
              </>
            )}
          </button>
        </div>

        {stats && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">İmport Nəticələri</h3>
                <ul className="mt-2 space-y-1 text-sm text-green-700">
                  <li>• Yeni Kateqoriya: <strong>{stats.categoriesCreated}</strong></li>
                  <li>• Yeni Alt Kateqoriya: <strong>{stats.subCategoriesCreated}</strong></li>
                  <li>• Yeni Məhsul: <strong>{stats.productsCreated}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Excel Fayl Strukturu</h3>
            <p className="text-sm text-blue-700 mt-1">
              Fayl aşağıdakı sütunlara malik olmalıdır (başlıqlar avtomatik tanınır):
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc list-inside ml-2">
              <li>Kateqoriya (Category)</li>
              <li>Alt Kateqoriya (Alt Kateqoriya)</li>
              <li>Məhsul Adı (Məhsul)</li>
              <li>Ölçü Vahidi (Ölçü Vahidi)</li>
              <li>Digər sütunlar spesifikasiya kimi qəbul ediləcək.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCategoriesPage;
