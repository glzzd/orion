const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    organization_name: {
      type: String,
      required: true
    },

    organization_code: {
      type: String,
      required: true,
      unique: true
    },

    organization_type: {
      type: String,
      enum: ["PRIVATE", "STATE", "MILITARY"],
      required: true
    },

    organization_status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "ARCHIVED"],
      default: "ACTIVE"
    },

    // 📍 Ümumi məlumat
    organization_profile: {
      legalName: String,
      registrationNumber: String,
      country: String,
      address: String
    },

    // Feature flags (modullar)
    features: {
      dashboard: { type: Boolean, default: true },
      hrm: { type: Boolean, default: true },
      payroll: { type: Boolean, default: false },
      performance: { type: Boolean, default: false },
      attendance: { type: Boolean, default: false },
      clearanceManagement: { type: Boolean, default: false }
    },

    audit: {
      createdAt: {
        type: Date,
        default: Date.now
      },
      createdBy: mongoose.Schema.Types.ObjectId,
      updatedAt: Date,
      updatedBy: mongoose.Schema.Types.ObjectId
    }
  },
  {
    collection: "organizations",
    timestamps: false
  }
);

module.exports = mongoose.model("Organization", OrganizationSchema);
