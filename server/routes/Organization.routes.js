const express = require("express");
const router = express.Router();
const OrganizationController = require("../controllers/Organization.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes here should be protected
router.use(authMiddleware);

router.get("/", OrganizationController.getOrganizations);

module.exports = router;
