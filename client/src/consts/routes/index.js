export const ROUTE_PATHS = {
  LOGIN: "auth/login",
  FORGOT_PASSWORD: "auth/forgot-password",
  RESET_PASSWORD: "auth/reset-password",
  DASHBOARD: "/",
};

export const PUBLIC_ROUTES = [
  { path: ROUTE_PATHS.LOGIN, name: "Login" },
  { path: ROUTE_PATHS.FORGOT_PASSWORD, name: "Forgot Password" },
  { path: ROUTE_PATHS.RESET_PASSWORD, name: "Reset Password" },
];

export const PRIVATE_ROUTES = [
  { path: ROUTE_PATHS.DASHBOARD, name: "Dashboard" },
];

export const ALL_ROUTES = {
  public: PUBLIC_ROUTES,
  private: PRIVATE_ROUTES,
};

