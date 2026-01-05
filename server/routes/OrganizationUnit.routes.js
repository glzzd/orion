const express = require("express");
const router = express.Router();
const OrganizationUnitController = require("../controllers/OrganizationUnit.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes here should be protected
router.use(authMiddleware);

router.get("/", OrganizationUnitController.getOrgUnits);
router.get("/:id", OrganizationUnitController.getOrgUnitById);
router.post("/", OrganizationUnitController.createOrgUnit);
router.put("/:id", OrganizationUnitController.updateOrgUnit);

module.exports = router;
