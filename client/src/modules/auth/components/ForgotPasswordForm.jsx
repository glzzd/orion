import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/consts/routes";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Şifrə sıfırlama linki e-poçtunuza göndərildi.");
    }, 1000);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">E-poçt</label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border p-2"
          placeholder="xxx.yyy@abc.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full cursor-pointer hover:scale-[1.02]">
        {loading ? "Göndərilir..." : "Link göndər"}
      </Button>

      <div className="text-center text-sm">
        <Link to={`/${ROUTE_PATHS.LOGIN}`} className="text-primary hover:underline">
          Giriş səhifəsinə qayıt
        </Link>
      </div>
    </form>
  );
}
