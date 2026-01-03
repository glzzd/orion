const express = require("express");
const router = express.Router();
const AdminUserController = require("../controllers/User.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Base path: /api/admin/users (will be configured in main routes)

router.get("/", authMiddleware, AdminUserController.getAllUsers);
router.post("/", authMiddleware, AdminUserController.createUser);
router.get("/:id", authMiddleware, AdminUserController.getUserById);
router.put("/:id", authMiddleware, AdminUserController.updateUser);
router.delete("/:id", authMiddleware, AdminUserController.deleteUser);

module.exports = router;
