const OrganizationUnit = require("../models/OrganizationUnit.model");

const getAllOrgUnits = async (tenantId) => {
  return await OrganizationUnit.find({ tenantId, status: "ACTIVE" }).sort({ name: 1 });
};

const getOrgUnitById = async (tenantId, id) => {
  return await OrganizationUnit.findOne({ _id: id, tenantId });
};

const createOrgUnit = async (tenantId, data, userId) => {
  const parent = data.parentId ? await OrganizationUnit.findOne({ _id: data.parentId, tenantId }) : null;
  const path = parent ? `${parent.path}/${data.name}` : data.name;
  const level = parent ? parent.level + 1 : 0;
  const exists = await OrganizationUnit.findOne({ tenantId, path });
  if (exists) {
    const err = new Error("Org unit path already exists");
    err.statusCode = 409;
    throw err;
  }
  const unit = new OrganizationUnit({
    tenantId,
    code: data.code,
    name: data.name,
    type: data.type,
    parentId: data.parentId || null,
    path,
    level,
    classification: data.classification || "INTERNAL",
    status: data.status || "ACTIVE",
    metadata: {
      shortName: data.metadata?.shortName,
      order: data.metadata?.order
    },
    audit: {
      createdBy: userId,
      createdAt: new Date()
    }
  });
  await unit.save();
  return unit;
};

const updateOrgUnit = async (tenantId, id, data, userId) => {
  const unit = await OrganizationUnit.findOne({ _id: id, tenantId });
  if (!unit) {
    const err = new Error("Org unit not found");
    err.statusCode = 404;
    throw err;
  }
  const parent = data.parentId !== undefined ? (data.parentId ? await OrganizationUnit.findOne({ _id: data.parentId, tenantId }) : null) : (unit.parentId ? await OrganizationUnit.findOne({ _id: unit.parentId, tenantId }) : null);
  const name = data.name ?? unit.name;
  const path = parent ? `${parent.path}/${name}` : name;
  if (path !== unit.path) {
    const exists = await OrganizationUnit.findOne({ tenantId, path });
    if (exists) {
      const err = new Error("Org unit path already exists");
      err.statusCode = 409;
      throw err;
    }
  }
  unit.code = data.code ?? unit.code;
  unit.name = name;
  unit.type = data.type ?? unit.type;
  unit.parentId = data.parentId !== undefined ? (data.parentId || null) : unit.parentId;
  unit.path = path;
  unit.level = parent ? parent.level + 1 : 0;
  unit.classification = data.classification ?? unit.classification;
  unit.status = data.status ?? unit.status;
  unit.metadata = {
    shortName: data.metadata?.shortName ?? unit.metadata?.shortName,
    order: data.metadata?.order ?? unit.metadata?.order
  };
  unit.audit = {
    ...unit.audit,
    updatedAt: new Date(),
    updatedBy: userId
  };
  await unit.save();
  return unit;
};

module.exports = {
  getAllOrgUnits,
  getOrgUnitById,
  createOrgUnit,
  updateOrgUnit
};
