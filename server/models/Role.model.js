const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    permissions: [{ type: String }],
    audit: {
      createdBy: mongoose.Schema.Types.ObjectId,
      updatedBy: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
