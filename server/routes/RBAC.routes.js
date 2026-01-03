const express = require("express");
const router = express.Router();
const RBACController = require("../controllers/RBAC.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Permissions
router.post("/permissions", authMiddleware, RBACController.createPermission);
router.get("/permissions", authMiddleware, RBACController.getAllPermissions);

// Roles
router.post("/roles", authMiddleware, RBACController.createRole);
router.get("/roles", authMiddleware, RBACController.getAllRoles);
router.put("/roles/:roleId/permissions", authMiddleware, RBACController.updateRolePermissions);

// Assignments
router.post("/users/assign-role", authMiddleware, RBACController.assignRoleToUser);
router.post("/users/remove-role", authMiddleware, RBACController.removeRoleFromUser);

module.exports = router;
