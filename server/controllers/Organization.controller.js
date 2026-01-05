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

const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationService.getOrganizationById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.error("Error in getOrganizationById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createOrganization = async (req, res) => {
  try {
    const org = await OrganizationService.createOrganization(req.body, req.user._id);
    res.status(201).json(org);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await OrganizationService.updateOrganization(id, req.body, req.user._id);
    res.status(200).json(updated);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
};
