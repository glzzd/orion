const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const PurchaseCategoryController = require("../controllers/PurchaseCategory.controller");

// Configure Multer for temporary storage
const upload = multer({ 
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Yalnız Excel faylları qəbul edilir!'));
    }
    cb(null, true);
  }
});

router.post("/categories/import", upload.single("file"), PurchaseCategoryController.importCategories);
router.post("/categories", PurchaseCategoryController.createCategory);
router.post("/products", PurchaseCategoryController.createProduct);
router.get("/products", PurchaseCategoryController.getAllProducts);
router.put("/categories/:id", PurchaseCategoryController.updateCategory);
router.put("/products/:id", PurchaseCategoryController.updateProduct);
router.get("/categories", PurchaseCategoryController.getAllCategories);
router.get("/categories/:parentId/sub", PurchaseCategoryController.getSubCategories);

module.exports = router;
