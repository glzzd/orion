const OrganizationUnitService = require("../services/OrganizationUnit.service");

const getOrgUnits = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
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

module.exports = {
  getOrgUnits,
  getOrgUnitById,
};
