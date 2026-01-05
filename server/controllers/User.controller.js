const UserService = require("../services/User.service");

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const { tenantId: queryTenantId } = req.query;
    let tenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    if (isSuperAdmin) {
      if (queryTenantId) {
        tenantId = queryTenantId;
      } else {
        tenantId = null;
      }
    }
    const result = await UserService.getAllUsers(tenantId, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Create User
const createUser = async (req, res, next) => {
  try {
    let tenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    if (isSuperAdmin && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    const user = await UserService.createUser(tenantId, req.body, req.user.id);
    res.status(201).json({ message: "İstifadəçi uğurla yaradıldı", user });
  } catch (error) {
    next(error);
  }
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    let tenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    if (isSuperAdmin && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    const user = await UserService.updateUser(tenantId, req.params.id, req.body, req.user.id);
    res.status(200).json({ message: "İstifadəçi məlumatları yeniləndi", user });
  } catch (error) {
    next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.user.tenantId, req.params.id);
    res.status(200).json({ message: "İstifadəçi silindi" });
  } catch (error) {
    next(error);
  }
};

// Get User By ID
const getUserById = async (req, res, next) => {
  try {
    let tenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    if (isSuperAdmin) {
      tenantId = req.query.tenantId || null;
    }
    const user = await UserService.getUserById(tenantId, req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
};
