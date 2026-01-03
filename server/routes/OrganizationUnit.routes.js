const express = require("express");
const router = express.Router();
const OrganizationUnitController = require("../controllers/OrganizationUnit.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes here should be protected
router.use(authMiddleware);

router.get("/", OrganizationUnitController.getOrgUnits);
router.get("/:id", OrganizationUnitController.getOrgUnitById);

module.exports = router;
