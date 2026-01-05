const OrganizationUnitService = require("../services/OrganizationUnit.service");

const getOrgUnits = async (req, res) => {
  try {
    let tenantId = req.user.tenantId;
    
    // Check if user is SUPER_ADMIN
    const isSuperAdmin = req.user.roles.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    
    if (isSuperAdmin && req.query.tenantId) {
        tenantId = req.query.tenantId;
    }

    const orgUnits = await OrganizationUnitService.getAllOrgUnits(tenantId);
    res.status(200).json(orgUnits);
  } catch (error) {
    console.error("Error in getOrgUnits:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrgUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const orgUnit = await OrganizationUnitService.getOrgUnitById(tenantId, id);

    if (!orgUnit) {
      return res.status(404).json({ message: "Organization Unit not found" });
    }

    res.status(200).json(orgUnit);
  } catch (error) {
    console.error("Error in getOrgUnitById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createOrgUnit = async (req, res) => {
  try {
    let tenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    if (isSuperAdmin && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    const unit = await OrganizationUnitService.createOrgUnit(tenantId, req.body, req.user._id);
    res.status(201).json(unit);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

const updateOrgUnit = async (req, res) => {
  try {
    let tenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    if (isSuperAdmin && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    const updated = await OrganizationUnitService.updateOrgUnit(tenantId, req.params.id, req.body, req.user._id);
    res.status(200).json(updated);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getOrgUnits,
  getOrgUnitById,
  createOrgUnit,
  updateOrgUnit
};
