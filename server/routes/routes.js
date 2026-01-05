const authRoutes = require("./Auth.routes");
const rbacRoutes = require("./RBAC.routes");
const adminUserRoutes = require("./User.routes");
const employeeRoutes = require("./Employee.routes");
const orgUnitRoutes = require("./OrganizationUnit.routes");
const organizationRoutes = require("./Organization.routes");
const purchaseRoutes = require("./Purchase.routes");


module.exports={
    authRoutes,
    rbacRoutes,
    adminUserRoutes,
    employeeRoutes,
    orgUnitRoutes,
    organizationRoutes,
    purchaseRoutes
}
