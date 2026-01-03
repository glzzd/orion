const mongoose = require("mongoose");

const OrganizationUnitSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    code: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "HEAD_OFFICE",
        "DIRECTORATE",
        "DEPARTMENT",
        "DIVISION"
      ]
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationUnit",
      default: null
    },

    path: {
      type: String,
      required: true,
      index: true
    },

    level: {
      type: Number,
      required: true,
      min: 0
    },

    classification: {
      type: String,
      enum: ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET"],
      default: "INTERNAL"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },

    metadata: {
      shortName: String,
      order: Number
    },

    audit: {
      createdAt: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId
      },
      updatedAt: Date,
      updatedBy: mongoose.Schema.Types.ObjectId
    }
  },
  {
    collection: "organization_units",
    timestamps: false
  }
);

// tenant daxilində path unikaldır
OrganizationUnitSchema.index({ tenantId: 1, path: 1 }, { unique: true });

module.exports = mongoose.model("OrganizationUnit", OrganizationUnitSchema);
