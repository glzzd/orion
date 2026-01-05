const Permission = require("../models/Permission.model");
const Role = require("../models/Role.model");
const User = require("../models/User.model");

// Permission Services
const createPermission = async (data) => {
  const permission = new Permission(data);
  return await permission.save();
};

const getAllPermissions = async () => {
  return await Permission.find();
};

// Role Services
const createRole = async (data) => {
  const role = new Role(data);
  return await role.save();
};

const updateRolePermissions = async (roleId, permissionIds) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");
  
  role.permissions = permissionIds;
  return await role.save();
};

const getAllRoles = async (tenantId) => {
  if (tenantId) {
    return await Role.find({ tenantId }).populate("permissions");
  }
  return await Role.find({}).populate("permissions");
};

// User Role Assignment
const assignRoleToUser = async (userId, roleId, assignedBy) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");

  // Check if user already has this role
  const hasRole = user.roles.some(r => r.roleId.toString() === roleId.toString());
  if (hasRole) throw new Error("User already has this role");

  user.roles.push({
    roleId: roleId,
    assignedBy: assignedBy,
    assignedAt: new Date()
  });

  await user.save();
  return user;
};

const removeRoleFromUser = async (userId, roleId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.roles = user.roles.filter(r => r.roleId.toString() !== roleId.toString());
  await user.save();
  return user;
};

module.exports = {
  createPermission,
  getAllPermissions,
  createRole,
  updateRolePermissions,
  getAllRoles,
  assignRoleToUser,
  removeRoleFromUser
};
