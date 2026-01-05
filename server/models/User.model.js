const mongoose = require("mongoose");

const PersonalDataSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    dateOfBirth: Date,
    nationality: String,
    citizenship: String
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    personalData: { type: PersonalDataSchema, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "TERMINATED"], default: "ACTIVE" },
    roles: [
      {
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
        assignedAt: { type: Date, default: Date.now },
        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    audit: {
      createdAt: { type: Date, default: Date.now },
      createdBy: { type: mongoose.Schema.Types.ObjectId },
      updatedAt: { type: Date },
      updatedBy: { type: mongoose.Schema.Types.ObjectId }
    }
  },
  { 
    collection: "users", 
    timestamps: true 
  }
);

UserSchema.index({ tenantId: 1, username: 1 }, { unique: true });
UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
