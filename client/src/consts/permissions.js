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
};
