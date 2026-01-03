const OrganizationUnit = require("../models/OrganizationUnit.model");

const getAllOrgUnits = async (tenantId) => {
  return await OrganizationUnit.find({ tenantId, status: "ACTIVE" }).sort({ "metadata.order": 1, name: 1 });
};

const getOrgUnitById = async (tenantId, id) => {
  return await OrganizationUnit.findOne({ _id: id, tenantId });
};

module.exports = {
  getAllOrgUnits,
  getOrgUnitById,
};
