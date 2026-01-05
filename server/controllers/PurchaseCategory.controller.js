const PurchaseCategoryService = require("../services/PurchaseCategory.service");

const importCategories = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Zəhmət olmasa fayl seçin." });
    }

    const result = await PurchaseCategoryService.importCategories(req.file.path);
    res.status(200).json({ message: "İmport uğurla tamamlandı.", data: result });
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({ message: "İmport zamanı xəta baş verdi.", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await PurchaseCategoryService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Məhsullar yüklənərkən xəta baş verdi.", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = await PurchaseCategoryService.createCategory(data);
    res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Kateqoriya yaradılarkən xəta baş verdi.", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const product = await PurchaseCategoryService.createProduct(data);
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Məhsul yaradılarkən xəta baş verdi.", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await PurchaseCategoryService.updateCategory(id, data);
    res.status(200).json(category);
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Kateqoriya yenilənərkən xəta baş verdi.", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await PurchaseCategoryService.updateProduct(id, data);
    res.status(200).json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Məhsul yenilənərkən xəta baş verdi.", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await PurchaseCategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get All Categories Error:", error);
    res.status(500).json({ message: "Kateqoriyalar yüklənərkən xəta baş verdi.", error: error.message });
  }
};

const getSubCategories = async (req, res) => {
    try {
        const { parentId } = req.params;
        const subCategories = await PurchaseCategoryService.getSubCategories(parentId);
        res.status(200).json(subCategories);
    } catch (error) {
        console.error("Get Sub Categories Error:", error);
        res.status(500).json({ message: "Alt kateqoriyalar yüklənərkən xəta baş verdi.", error: error.message });
    }
}

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await PurchaseCategoryService.getProductsByCategory(categoryId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products By Category Error:", error);
    res.status(500).json({ message: "Məhsullar yüklənərkən xəta baş verdi.", error: error.message });
  }
};

module.exports = {
  importCategories,
  getAllProducts,
  createCategory,
  createProduct,
  updateCategory,
  updateProduct,
  getAllCategories,
  getSubCategories,
  getProductsByCategory
};
