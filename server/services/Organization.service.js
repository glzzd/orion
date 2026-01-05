const Organization = require("../models/Organization.model");
const fs = require("fs");
const path = require("path");

const getAllOrganizations = async () => {
  return await Organization.find().select("organization_name organization_code organization_type organization_status _id logoUrl");
};

const getOrganizationById = async (id) => {
  return await Organization.findById(id);
};

const createOrganization = async (data, userId) => {
  const exists = await Organization.findOne({ organization_code: data.organization_code });
  if (exists) {
    const error = new Error("Organization code already exists");
    error.statusCode = 409;
    throw error;
  }

  const org = new Organization({
    organization_name: data.organization_name,
    organization_code: data.organization_code,
    organization_type: data.organization_type,
    organization_status: data.organization_status || "ACTIVE",
    organization_profile: data.organization_profile || {},
    features: data.features || {},
    audit: { createdBy: userId }
  });

  await org.save();

  if (data.logoBase64) {
    const savedUrl = await saveLogo(org._id.toString(), data.logoBase64);
    org.logoUrl = savedUrl;
    await org.save();
  }
  return org;
};

const updateOrganization = async (id, data, userId) => {
  const existing = await Organization.findById(id);
  if (!existing) {
    const error = new Error("Organization not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.organization_code && data.organization_code !== existing.organization_code) {
    const codeExists = await Organization.findOne({ organization_code: data.organization_code });
    if (codeExists) {
      const error = new Error("Organization code already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  existing.organization_name = data.organization_name ?? existing.organization_name;
  existing.organization_code = data.organization_code ?? existing.organization_code;
  existing.organization_type = data.organization_type ?? existing.organization_type;
  existing.organization_status = data.organization_status ?? existing.organization_status;
  existing.organization_profile = data.organization_profile ?? existing.organization_profile;
  existing.features = data.features ?? existing.features;
  existing.audit = {
    ...existing.audit,
    updatedAt: new Date(),
    updatedBy: userId
  };

  if (data.logoBase64) {
    const savedUrl = await saveLogo(existing._id.toString(), data.logoBase64);
    existing.logoUrl = savedUrl;
  }

  await existing.save();
  return existing;
};

const saveLogo = async (orgId, dataUrl) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    const error = new Error("Invalid logo data");
    error.statusCode = 400;
    throw error;
  }
  const mime = match[1];
  const base64 = match[2];
  const ext = mime.split("/")[1].replace("+xml", "");
  const dir = path.join(__dirname, "..", "uploads", "organizations", orgId);
  await fs.promises.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `logo.${ext}`);
  await fs.promises.writeFile(filePath, Buffer.from(base64, "base64"));
  const urlPath = `/uploads/organizations/${orgId}/logo.${ext}`;
  return urlPath;
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
};
