const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/Employee.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes here should be protected
router.use(authMiddleware);

router.get("/", EmployeeController.getEmployees);
router.get("/:id", EmployeeController.getEmployeeById);

module.exports = router;
