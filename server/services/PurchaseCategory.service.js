const xlsx = require("xlsx");
const fs = require("fs");
const PurchaseCategory = require("../models/PurchaseCategory.model");
const PurchaseProduct = require("../models/PurchaseProduct.model");

const importCategories = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!data || data.length === 0) {
      throw new Error("Excel faylı boşdur və ya oxuna bilmədi.");
    }

    // Headers (keys of the first object)
    const headers = Object.keys(data[0]);
    
    // Define standard column matchers
    const STANDARD_COLUMNS = {
      category: ["kateqoriya", "category", "kategori", "main category"],
      subCategory: ["alt kateqoriya", "sub category", "subcategory", "alt kategori"],
      product: ["məhsul", "məhsul adı", "product", "product name", "mehsul", "mehsul adi"],
      specifications: ["specifications", "spesifikasyonlar", "xüsusiyyətlər", "özəlliklər"]
    };

    // Map actual headers to standard keys
    const headerMapping = {}; 
    
    for (const header of headers) {
      const normalizedHeader = header.toString().toLowerCase().trim();
      
      for (const [key, variations] of Object.entries(STANDARD_COLUMNS)) {
        if (variations.includes(normalizedHeader)) {
          headerMapping[header] = key;
          break;
        }
      }
    }
    
    // Fallback by index 
    const foundTypes = Object.values(headerMapping);
    if (!foundTypes.includes("category") && headers.length > 0) headerMapping[headers[0]] = "category";
    if (!foundTypes.includes("subCategory") && headers.length > 1) headerMapping[headers[1]] = "subCategory";
    if (!foundTypes.includes("product") && headers.length > 2) headerMapping[headers[2]] = "product";
    if (!foundTypes.includes("specifications") && headers.length > 3) headerMapping[headers[3]] = "specifications";

    let stats = {
      categoriesCreated: 0,
      subCategoriesCreated: 0,
      productsCreated: 0
    };

    // Keep track of context for filled-down values
    let lastCategory = null;
    let lastSubCategory = null;
    let lastProduct = null;

    for (const row of data) {
      let categoryName, subCategoryName, productName, specName;

      for (const key of Object.keys(row)) {
        const type = headerMapping[key];
        const value = row[key];
        
        if (type === "category") categoryName = value;
        else if (type === "subCategory") subCategoryName = value;
        else if (type === "product") productName = value;
        else if (type === "specifications") specName = value;
      }

      // Handle filled-down logic (if cell is empty, use previous row's value)
      // BUT: Only if the row seems to be part of the same block.
      // If "Category" is present, it's a new block or explicit definition.
      // If "Category" is empty but we have "lastCategory", we assume it's a continuation.
      
      if (categoryName) lastCategory = categoryName;
      else categoryName = lastCategory;

      if (subCategoryName) lastSubCategory = subCategoryName;
      else subCategoryName = lastSubCategory;

      if (productName) lastProduct = productName;
      else productName = lastProduct;

      if (!categoryName) continue; 

      // 1. Find or Create Category
      let category = await PurchaseCategory.findOne({ name: categoryName, parent: null });
      if (!category) {
        category = await PurchaseCategory.create({ name: categoryName });
        stats.categoriesCreated++;
      }

      // 2. Find or Create SubCategory
      let targetCategory = category;
      if (subCategoryName) {
        let subCategory = await PurchaseCategory.findOne({ name: subCategoryName, parent: category._id });
        if (!subCategory) {
          subCategory = await PurchaseCategory.create({ 
            name: subCategoryName, 
            parent: category._id 
          });
          stats.subCategoriesCreated++;
        }
        targetCategory = subCategory;
      }

      // 3. Find or Create Product
      if (productName) {
        let product = await PurchaseProduct.findOne({ 
          name: productName, 
          category: targetCategory._id 
        });

        if (!product) {
          product = await PurchaseProduct.create({
            name: productName,
            category: targetCategory._id,
            specifications: []
          });
          stats.productsCreated++;
        }

        // 4. Add Specification if present
        if (specName) {
            // Check if spec already exists to avoid duplicates
            const specExists = product.specifications.some(s => s.key === specName);
            if (!specExists) {
                product.specifications.push({
                    key: specName,
                    value: "" // Default value empty as per requirement
                });
                await product.save();
            }
        }
      }
    }

    // Clean up file
    fs.unlinkSync(filePath);

    return { success: true, stats };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

const getAllProducts = async () => {
  return await PurchaseProduct.find()
    .populate({
      path: 'category',
      populate: { path: 'parent' }
    })
    .sort({ createdAt: -1 });
};

const createCategory = async (data) => {
  return await PurchaseCategory.create(data);
};

const createProduct = async (data) => {
  return await PurchaseProduct.create(data);
};

const updateCategory = async (id, data) => {
  return await PurchaseCategory.findByIdAndUpdate(id, data, { new: true });
};

const updateProduct = async (id, data) => {
  return await PurchaseProduct.findByIdAndUpdate(id, data, { new: true });
};

const getAllCategories = async () => {
  // Fetch only main categories (parent: null)
  return await PurchaseCategory.find({ parent: null }).sort({ name: 1 });
};

const getSubCategories = async (parentId) => {
    return await PurchaseCategory.find({ parent: parentId }).sort({ name: 1 });
};

module.exports = {
  importCategories,
  getAllProducts,
  createCategory,
  createProduct,
  updateCategory,
  updateProduct,
  getAllCategories,
  getSubCategories
};
