const RBACService = require("../services/RBAC.service");

// Permissions
const createPermission = async (req, res, next) => {
  try {
    const permission = await RBACService.createPermission(req.body);
    res.status(201).json(permission);
  } catch (error) {
    next(error);
  }
};

const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await RBACService.getAllPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    next(error);
  }
};

// Roles
const createRole = async (req, res, next) => {
  try {
    // Assuming tenantId comes from authenticated user or body
    const roleData = { ...req.body, tenantId: req.user?.tenantId || req.body.tenantId };
    const role = await RBACService.createRole(roleData);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

const updateRolePermissions = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body; // Array of Permission IDs
    const role = await RBACService.updateRolePermissions(roleId, permissions);
    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const getAllRoles = async (req, res, next) => {
  try {
    const tenantId = req.user?.tenantId || req.query.tenantId;
    const roles = await RBACService.getAllRoles(tenantId);
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

// User Assignment
const assignRoleToUser = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;
    const assignedBy = req.user?.id;
    const user = await RBACService.assignRoleToUser(userId, roleId, assignedBy);
    res.status(200).json({ message: "Role assigned successfully", user });
  } catch (error) {
    next(error);
  }
};

const removeRoleFromUser = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;
    const user = await RBACService.removeRoleFromUser(userId, roleId);
    res.status(200).json({ message: "Role removed successfully", user });
  } catch (error) {
    next(error);
  }
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
