const Organization = require("../models/Organization.model");

const getAllOrganizations = async () => {
  return await Organization.find({ organization_status: "ACTIVE" }).select("organization_name _id");
};

module.exports = {
  getAllOrganizations,
};
