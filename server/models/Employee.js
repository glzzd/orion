import mongoose from "mongoose";

const JobAssignmentSchema = new mongoose.Schema(
  {
    organizationUnitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationUnit",
      required: true
    },

    organizationUnitPath: {
      type: String,
      required: true,
      index: true
    },

    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    rank: {
      type: String 
    },

    serviceType: {
      type: String,
      enum: ["CIVIL", "STATE", "MILITARY"],
      default: "CIVIL"
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      default: null
    }
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    employeeCode: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "TERMINATED"],
      default: "ACTIVE"
    },

    classification: {
      type: String,
      enum: ["INTERNAL", "CONFIDENTIAL", "SECRET"],
      default: "INTERNAL"
    },

    personalData: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      fatherName: { type: String, required: true },
      gender: {
        type: String,
        enum: ["MALE", "FEMALE"]
      },
      dateOfBirth: { type: Date, required: true },
      
    },

    jobData: {
      primaryAssignment: {
        type: JobAssignmentSchema,
        required: true
      },

      additionalAssignments: {
        type: [JobAssignmentSchema],
        default: []
      }
    },

    flags: {
      hasIdentityData: {
        type: Boolean,
        default: false
      },
      hasSalaryData: {
        type: Boolean,
        default: false
      },
      hasClearance: {
        type: Boolean,
        default: false
      }
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
    collection: "employees",
    timestamps: false
  }
);

EmployeeSchema.index({ tenantId: 1, employeeCode: 1 }, { unique: true });
EmployeeSchema.index({
  tenantId: 1,
  "jobData.primaryAssignment.organizationUnitPath": 1
});

export default mongoose.model("Employee", EmployeeSchema);
