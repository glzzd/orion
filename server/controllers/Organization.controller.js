const OrganizationService = require("../services/Organization.service");

const getOrganizations = async (req, res) => {
  try {
    const organizations = await OrganizationService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error in getOrganizations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOrganizations,
};
