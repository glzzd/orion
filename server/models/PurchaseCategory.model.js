const mongoose = require("mongoose");

const PurchaseCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseCategory", default: null },
  slug: { type: String },
  description: { type: String },
}, { timestamps: true });

// Helper to ensure slug uniqueness if needed, but for now simple string is fine.

module.exports = mongoose.model("PurchaseCategory", PurchaseCategorySchema);
