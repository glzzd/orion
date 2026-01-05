const mongoose = require("mongoose");

const PurchaseProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseCategory", required: true },
  unit: { type: String }, // e.g., kg, ədəd, litr
  specifications: [{
    key: String,
    value: String
  }],
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("PurchaseProduct", PurchaseProductSchema);
