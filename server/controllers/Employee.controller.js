const EmployeeService = require("../services/Employee.service");

const getEmployees = async (req, res) => {
  try {
    const { page, limit, search, sortKey, sortDir, tenantId: queryTenantId } = req.query;
    let tenantId = req.user.tenantId;

    // Check if user is SUPER_ADMIN
    const isSuperAdmin = req.user.roles.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");

    if (isSuperAdmin) {
        // If queryTenantId is provided, use it.
        // If it is NOT provided (undefined or empty), it means "All Organizations", so we set tenantId to null.
        if (queryTenantId) {
            tenantId = queryTenantId;
        } else {
            tenantId = null;
        }
    }

    const result = await EmployeeService.getAllEmployees(tenantId, {
      page,
      limit,
      search,
      sortKey,
      sortDir,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getEmployees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    let tenantId = req.user.tenantId;
    
    // Check if user is SUPER_ADMIN
    const isSuperAdmin = req.user.roles.some(r => r.roleId && r.roleId.name === "SUPER_ADMIN");
    
    if (isSuperAdmin) {
         if (req.query.tenantId) {
            tenantId = req.query.tenantId;
         } else {
            // If super admin and no tenant specified, try to find globally?
            // The service might need adjustment if we want global find by ID.
            // For now, let's allow null tenantId in service for getById too if needed.
            tenantId = null;
         }
    }

    const employee = await EmployeeService.getEmployeeById(tenantId, id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
};
