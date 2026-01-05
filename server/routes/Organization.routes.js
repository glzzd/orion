const express = require("express");
const router = express.Router();
const OrganizationController = require("../controllers/Organization.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes here should be protected
router.use(authMiddleware);

router.get("/", OrganizationController.getOrganizations);
router.post("/", OrganizationController.createOrganization);
router.get("/:id", OrganizationController.getOrganizationById);
router.put("/:id", OrganizationController.updateOrganization);

module.exports = router;
