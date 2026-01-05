require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Organization = require("../models/Organization.model");
const OrganizationUnit = require("../models/OrganizationUnit.model");
const Employee = require("../models/Employee");
const User = require("../models/User.model");
const Role = require("../models/Role.model");
const Permission = require("../models/Permission.model");
const { hashPassword } = require("../utils/hash");

// --- Helper Functions for Random Data ---
const maleNames = ["Ali", "Samir", "Elvin", "Vusal", "Murad", "Rashad", "Tural", "Ilgar", "Mammad", "Hasan", "Kamran", "Orkhan", "Farid", "Nijat", "Anar"];
const femaleNames = ["Leyla", "Aysel", "Gunel", "Nigar", "Sevinc", "Mehriban", "Fidan", "Turkan", "Gulnar", "Lala", "Narmin", "Zahra", "Ayan", "Fatimə", "Xadija"];
const surnames = ["Mammadov", "Aliyev", "Hasanov", "Guliyev", "Huseynov", "Abdullayev", "Ismayilov", "Mustafayev", "Bagirov", "Safarov", "Jafarov", "Ahmedov", "Karimov", "Valiyev", "Mahmudov"];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateName = (gender) => {
  const firstName = gender === "MALE" ? getRandomElement(maleNames) : getRandomElement(femaleNames);
  const lastNameBase = getRandomElement(surnames);
  const lastName = gender === "FEMALE" ? lastNameBase + "a" : lastNameBase;
  const fatherName = getRandomElement(maleNames);
  return { firstName, lastName, fatherName };
};

const generateDateOfBirth = () => {
  const start = new Date(1970, 0, 1);
  const end = new Date(2000, 0, 1);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// --- Main Seed Function ---
const seed = async () => {
  try {
    // Connect to Database
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in .env");
    }
    
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database...");

    // 0. Seed Permissions
    const permissionsList = [
      // DASHBOARD
      { slug: "dashboard:read", name: "Dashboard Görüntüləmə", group: "Dashboard" },
      
      // HR
      { slug: "hr:read", name: "HR Məlumatlarını Görüntüləmə", group: "HR" },
      { slug: "hr:create", name: "HR Məlumatlarını Yaratma", group: "HR" },
      { slug: "hr:update", name: "HR Məlumatlarını Yeniləmə", group: "HR" },
      { slug: "hr:delete", name: "HR Məlumatlarını Silmə", group: "HR" },

      // ADMIN
      { slug: "admin:read", name: "Admin Panel Görüntüləmə", group: "Admin" },
      { slug: "admin:create", name: "Admin Məlumatlarını Yaratma", group: "Admin" },
      { slug: "admin:update", name: "Admin Məlumatlarını Yeniləmə", group: "Admin" },
      { slug: "admin:delete", name: "Admin Məlumatlarını Silmə", group: "Admin" },
      { slug: "admin:users", name: "İstifadəçiləri İdarəetmə", group: "Admin" },
      { slug: "admin:roles", name: "Rollar və İcazələri İdarəetmə", group: "Admin" },
      { slug: "admin:logs", name: "Sistem Loglarını Görüntüləmə", group: "Admin" },
      { slug: "admin:settings", name: "Sistem Ayarlarını İdarəetmə", group: "Admin" },
      { slug: "admin:organizations", name: "Qurum və Təşkilat Parametrlərini İdarəetmə", group: "Admin" },
    ];

    console.log("Seeding permissions...");
    const permissionIds = [];
    for (const p of permissionsList) {
      let permission = await Permission.findOne({ slug: p.slug });
      if (!permission) {
        permission = await Permission.create(p);
      } else {
        permission.name = p.name;
        permission.group = p.group;
        await permission.save();
      }
      permissionIds.push(permission._id);
    }
    console.log(`Permissions seeded. Total: ${permissionIds.length}`);

    // --- Define Organizations to Seed ---
    const organizationsToSeed = [
      {
        name: "METORA",
        code: "METORA001",
        type: "PRIVATE",
        profile: { legalName: "METORA LLC", country: "Azerbaijan", address: "Baku, Narimanov" }
      },
      {
        name: "CASPIAN ENERGY",
        code: "CSPE002",
        type: "STATE",
        profile: { legalName: "Caspian Energy CJSC", country: "Azerbaijan", address: "Baku, Sabail" }
      },
      {
        name: "GLOBAL LOGISTICS",
        code: "GLOG003",
        type: "PRIVATE",
        profile: { legalName: "Global Logistics Ltd", country: "Azerbaijan", address: "Sumgait, Industrial Zone" }
      }
    ];

    let mainOrgId = null; // Will store METORA's ID for the admin user

    for (const orgData of organizationsToSeed) {
      console.log(`Processing Organization: ${orgData.name}...`);

      // 1. Create/Update Organization
      let org = await Organization.findOne({ organization_code: orgData.code });
      if (!org) {
        org = await Organization.create({
          organization_name: orgData.name,
          organization_code: orgData.code,
          organization_type: orgData.type,
          organization_status: "ACTIVE",
          organization_profile: orgData.profile,
          features: {
            dashboard: true,
            hrm: true,
            payroll: true,
            performance: true,
            attendance: true,
            clearanceManagement: true
          }
        });
        console.log(`  Organization created.`);
      } else {
        console.log(`  Organization exists.`);
      }

      if (orgData.code === "METORA001") mainOrgId = org._id;

      // 2. Create Organization Units (Structure)
      // Clear existing units for this tenant to ensure clean structure or just check existence
      // For simplicity in this seed, we'll try to create if not exists
      
      const unitsStructure = [
        { name: "Baş Ofis", code: "HO", type: "HEAD_OFFICE", parent: null },
        { name: "HR Departamenti", code: "HR", type: "DEPARTMENT", parent: "HO" },
        { name: "IT Departamenti", code: "IT", type: "DEPARTMENT", parent: "HO" },
        { name: "Maliyyə Departamenti", code: "FIN", type: "DEPARTMENT", parent: "HO" },
        { name: "Satış Departamenti", code: "SALE", type: "DEPARTMENT", parent: "HO" },
        { name: "Hüquq Şöbəsi", code: "LEG", type: "DIVISION", parent: "HO" }
      ];

      const createdUnits = {}; // Map code -> Unit Object

      for (const unitDef of unitsStructure) {
        const parentUnit = unitDef.parent ? createdUnits[unitDef.parent] : null;
        const path = parentUnit ? `${parentUnit.path}/${unitDef.name}` : unitDef.name;
        
        let unit = await OrganizationUnit.findOne({ tenantId: org._id, code: unitDef.code });
        
        if (!unit) {
          unit = await OrganizationUnit.create({
            tenantId: org._id,
            code: unitDef.code,
            name: unitDef.name,
            type: unitDef.type,
            parentId: parentUnit ? parentUnit._id : null,
            path: path,
            level: parentUnit ? parentUnit.level + 1 : 0,
            status: "ACTIVE"
          });
        }
        createdUnits[unitDef.code] = unit;
      }
      console.log(`  Org Units ensured.`);

      // 3. Create Employees (50 per Org)
      const currentEmployeeCount = await Employee.countDocuments({ tenantId: org._id });
      if (currentEmployeeCount < 50) {
        console.log(`  Creating employees to reach 50 (Current: ${currentEmployeeCount})...`);
        const employeesNeeded = 50 - currentEmployeeCount;
        const unitKeys = Object.keys(createdUnits);
        
        const employeesToInsert = [];

        for (let i = 0; i < employeesNeeded; i++) {
          const gender = Math.random() > 0.5 ? "MALE" : "FEMALE";
          const nameData = generateName(gender);
          const randomUnitKey = getRandomElement(unitKeys);
          const unit = createdUnits[randomUnitKey];

          employeesToInsert.push({
            tenantId: org._id,
            employeeCode: `${orgData.code}-EMP-${currentEmployeeCount + i + 1}`,
            status: "ACTIVE",
            classification: "INTERNAL",
            personalData: {
              firstName: nameData.firstName,
              lastName: nameData.lastName,
              fatherName: nameData.fatherName,
              gender: gender,
              dateOfBirth: generateDateOfBirth(),
            },
            jobData: {
              primaryAssignment: {
                organizationUnitId: unit._id,
                organizationUnitPath: unit.path,
                positionId: new mongoose.Types.ObjectId(), // Random ID as Position model doesn't exist yet
                role: "Specialist",
                serviceType: "CIVIL",
                startDate: new Date(2020, 0, 1)
              },
              additionalAssignments: []
            },
            flags: {
              hasIdentityData: true,
              hasSalaryData: true,
              hasClearance: false
            }
          });
        }

        if (employeesToInsert.length > 0) {
          await Employee.insertMany(employeesToInsert);
          console.log(`  ${employeesToInsert.length} employees created.`);
        }
      } else {
        console.log(`  Employees already sufficient (${currentEmployeeCount}).`);
      }
    }

    // --- Create/Update Super Admin Role & User for METORA ---
    if (mainOrgId) {
        // Create Role
        const roleData = {
            name: "SUPER_ADMIN",
            description: "Full access to all features",
            tenantId: mainOrgId,
            permissions: permissionIds,
            isSystem: true
        };
  
        let role = await Role.findOne({ name: "SUPER_ADMIN", tenantId: mainOrgId });
        if (!role) {
            role = await Role.create(roleData);
            console.log("Role SUPER_ADMIN created.");
        } else {
             // Update permissions
             role.permissions = permissionIds;
             await role.save();
        }
  
        // Create User
        const userData = {
            tenantId: mainOrgId,
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
            roles: [{ 
                roleId: role._id, 
                assignedAt: new Date(),
                assignedBy: null
            }],
            status: "ACTIVE"
        };
  
        const hashedPassword = await hashPassword("metora123");
        let user = await User.findOne({ email: userData.email });
  
        if (!user) {
            user = await User.create({
                ...userData,
                password: hashedPassword
            });
            console.log("User metora_admin created.");
        } else {
             // Ensure admin has the role
             user.roles = userData.roles;
             await user.save();
        }
    }

    console.log("-----------------------------------");
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
