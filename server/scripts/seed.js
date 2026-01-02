require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Organization = require("../models/Organization.model");
const User = require("../models/User.model");
const Role = require("../models/Role.model");
const { hashPassword } = require("../utils/hash");

const seed = async () => {
  try {
    // Connect to Database
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in .env");
    }
    
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database...");

    // 1. Create Organization "METORA"
    const orgData = {
      organization_name: "METORA",
      organization_code: "METORA001",
      organization_type: "PRIVATE",
      organization_status: "ACTIVE",
      organization_profile: {
        legalName: "METORA LLC",
        country: "Azerbaijan",
        address: "Baku, Azerbaijan"
      },
      features: {
        dashboard: true,
        hrm: true,
        payroll: true,
        performance: true,
        attendance: true,
        clearanceManagement: true
      }
    };

    let org = await Organization.findOne({ organization_code: orgData.organization_code });
    
    if (org) {
      console.log("Organization METORA already exists. Updating...");
      Object.assign(org, orgData);
      await org.save();
    } else {
      org = await Organization.create(orgData);
      console.log("Organization METORA created.");
    }

    // 2. Create Role "SUPER_ADMIN"
    const roleData = {
      name: "SUPER_ADMIN",
      description: "Full access to all features",
      tenantId: org._id,
      permissions: ["*"] // All permissions
    };

    let role = await Role.findOne({ name: "SUPER_ADMIN", tenantId: org._id });
    
    if (role) {
      console.log("Role SUPER_ADMIN already exists. Updating...");
      Object.assign(role, roleData);
      await role.save();
    } else {
      role = await Role.create(roleData);
      console.log("Role SUPER_ADMIN created.");
    }

    // 3. Create User
    const userData = {
      tenantId: org._id,
      personalData: {
        firstName: "Admin",
        lastName: "User",
        fatherName: "System",
        gender: "MALE",
        dateOfBirth: new Date("1990-01-01"),
        nationality: "Azerbaijani",
        citizenship: "Azerbaijani"
      },
      username: "metora_admin",
      email: "admin@metora.az",
      roles: [role._id],
      status: "ACTIVE"
    };

    // Hash password
    const hashedPassword = await hashPassword("metora123");

    let user = await User.findOne({ email: userData.email });

    if (user) {
      console.log("User already exists. Updating...");
      user.tenantId = userData.tenantId;
      user.personalData = userData.personalData;
      user.roles = userData.roles;
      user.status = userData.status;
      // We don't update password here to avoid locking out if it was changed
      await user.save();
    } else {
      user = await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log("User metora_admin created.");
    }

    console.log("Seed completed successfully.");
    console.log("-----------------------------------");
    console.log("Organization: METORA");
    console.log("User: metora_admin");
    console.log("Password: metora123");
    console.log("-----------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
