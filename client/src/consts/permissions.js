// rbac/permissions.js
export const PERMISSIONS = {
  DASHBOARD: {
    READ: "dashboard:read",
  },

  HR: {
    READ: "hr:read",
    CREATE: "hr:create",
    UPDATE: "hr:update",
    DELETE: "hr:delete",
  },

  ADMIN: {
    READ: "admin:read",
    CREATE: "admin:create",
    UPDATE: "admin:update",
    DELETE: "admin:delete",
    USERS: "admin:users",
    ROLES: "admin:roles",
    PERMISSIONS: "admin:permissions",
    LOGS: "admin:logs",
    SETTINGS: "admin:settings",
    ORGANIZATIONS: "admin:organizations",
    AUDIT: "admin:audit",
  },

  PURCHASE: {
    READ: "purchase:read",
    CREATE: "purchase:create",
    UPDATE: "purchase:update",
    DELETE: "purchase:delete",
    ORDERS: "purchase:orders",
    SUPPLIERS: "purchase:suppliers",
    LOTS: "purchase:lots",
    CONTRACTS: "purchase:contracts",
    PRODUCTS: "purchase:products",
    CATEGORIES: "purchase:categories",
  },
};
