require("dotenv").config(); // Çevresel değişkenleri en başta yükle
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("./config/database");
const allRoutes = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors()); 
app.use(express.json({ limit: "15mb" })); 
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectToDatabase();

app.use("/api", allRoutes.authRoutes);
app.use("/api/rbac", allRoutes.rbacRoutes);
app.use("/api/admin/users", allRoutes.adminUserRoutes);
app.use("/api/hr/employees", allRoutes.employeeRoutes);
app.use("/api/org-units", allRoutes.orgUnitRoutes);
app.use("/api/organizations", allRoutes.organizationRoutes);
app.use("/api/purchase", allRoutes.purchaseRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
