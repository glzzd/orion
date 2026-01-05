import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/consts/routes";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += charset[Math.floor(Math.random() * charset.length)];
    }
    setPassword(pwd);
    setConfirmPassword(pwd);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Şifrə ən az 6 simvol olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Şifrələr uyğun gəlmir.");
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Şifrəniz uğurla yeniləndi. Zəhmət olmasa yenidən daxil olun.");
      navigate(`/${ROUTE_PATHS.LOGIN}`);
    }, 1000);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">Yeni şifrə</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-md border p-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={generateRandomPassword}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Random password"
            title="Random şifrə"
          >
            <RefreshCcw size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="confirmPassword">Şifrəni təsdiqlə</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="w-full rounded-md border p-2 pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full cursor-pointer hover:scale-[1.02]">
        {loading ? "Yenilənir..." : "Şifrəni yenilə"}
      </Button>
    </form>
  );
}
