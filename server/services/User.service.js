const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const getAllUsers = async (tenantId, { page = 1, limit = 10, search, sortKey, sortDir }) => {
  const skip = (page - 1) * limit;
  const query = {};
  if (tenantId) {
    query.tenantId = tenantId;
  }

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { "personalData.firstName": { $regex: search, $options: "i" } },
      { "personalData.lastName": { $regex: search, $options: "i" } },
    ];
  }

  let sort = {};
  if (sortKey) {
    sort[sortKey] = sortDir === "desc" ? -1 : 1;
  } else {
    sort = { createdAt: -1 };
  }

  const users = await User.find(query)
    .select("-password")
    .populate("roles.roleId", "name")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  return {
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createUser = async (tenantId, userData, creatorId) => {
  const { username, email, password, personalData, roles, status } = userData;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
    tenantId
  });

  if (existingUser) {
    const error = new Error("Bu istifadəçi adı və ya e-mail ünvanı artıq mövcuddur.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    tenantId,
    username,
    email,
    password: hashedPassword,
    personalData,
    roles: roles.map(roleId => ({ roleId, assignedBy: creatorId })),
    status: status || "ACTIVE",
    audit: {
      createdBy: creatorId
    }
  });

  await newUser.save();
  return newUser;
};

const updateUser = async (tenantId, userId, updateData, updaterId) => {
  delete updateData.password;
  delete updateData.tenantId;

  updateData.audit = { updatedBy: updaterId };

  const user = await User.findOneAndUpdate(
    { _id: userId, tenantId },
    updateData,
    { new: true }
  ).select("-password");

  if (!user) {
    const error = new Error("İstifadəçi tapılmadı");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const deleteUser = async (tenantId, userId) => {
  const user = await User.findOneAndDelete({ _id: userId, tenantId });

  if (!user) {
    const error = new Error("İstifadəçi tapılmadı");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const getUserById = async (tenantId, userId) => {
  const user = await User.findOne({ _id: userId, tenantId })
    .select("-password")
    .populate("roles.roleId", "name");

  if (!user) {
    const error = new Error("İstifadəçi tapılmadı");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
};
