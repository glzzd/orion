const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Human readable name e.g. "Create User"
    slug: { type: String, required: true, unique: true }, // System name e.g. "user.create"
    description: String,
    group: { type: String, required: true }, // e.g. "User Management"
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Optional: if permissions are custom per tenant
    audit: {
      createdBy: mongoose.Schema.Types.ObjectId,
      updatedBy: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", PermissionSchema);
