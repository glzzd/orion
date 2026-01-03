const UserService = require("../services/User.service");

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const result = await UserService.getAllUsers(req.user.tenantId, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Create User
const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.user.tenantId, req.body, req.user.id);
    res.status(201).json({ message: "İstifadəçi uğurla yaradıldı", user });
  } catch (error) {
    next(error);
  }
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.user.tenantId, req.params.id, req.body, req.user.id);
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
    const user = await UserService.getUserById(req.user.tenantId, req.params.id);
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
