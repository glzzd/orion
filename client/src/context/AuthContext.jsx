import { useMemo, useState } from "react";
import AuthContext from "@/context/auth-context";
import { loginUser } from "@/modules/auth/api/auth.api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password, rememberMe = false) => {
    try {
      const data = await loginUser(username, password);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      
      // Store tokens
      storage.setItem("accessToken", data.token);
      storage.setItem("refreshToken", data.refreshToken);
      
      // Store user
      storage.setItem("authUser", JSON.stringify(data.user));
      
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { 
        ok: false, 
        error: error.response?.data?.message || error.message || "Giriş zamanı xəta baş verdi" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    
    setUser(null);
  };

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
