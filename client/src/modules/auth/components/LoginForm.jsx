import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth.js";
import { ROUTE_PATHS } from "@/consts/routes";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(username.trim(), password, rememberMe);
    setLoading(false);
    if (res.ok) {
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="username">İstifadəçi adı</label>
        <input
          id="username"
          className="w-full rounded-md border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">Şifrə</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-md border p-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Məni xatırla
          </label>
        </div>
        <Link
          to={`/${ROUTE_PATHS.FORGOT_PASSWORD}`}
          className="text-sm font-medium hover:underline cursor-pointer text-blue-500"
        >
          Şifrənizi unutmusunuz?
        </Link>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full cursor-pointer hover:scale-[1.02]">
        {loading ? "Daxil olunur..." : "Daxil ol"}
      </Button>
    </form>
  );
}
