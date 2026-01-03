import LoginArea from "../components/LoginArea";
import bg from "@/assets/auth-bg.jpg";
import logo from "@/assets/orionlogo.png";

export default function Login() {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden p-6">
        <img
          src={bg}
          alt="Background"
          className="h-full w-full object-cover rounded-3xl"
        />
        <img
          src={logo}
          alt="Logo"
          className="absolute left-15 top-15 z-10"
        />
        <div className="absolute left-15 bottom-30 text-white z-10 flex flex-col space-y-2 max-w-lg">
          <span className="text-3xl font-bold">ORİON ERP Sistemi</span>
          <span className="text-sm leading-relaxed text-white/90">
            Müasir müəssisələr üçün nəzərdə tutulmuş, maliyyə, insan resursları,
            əməliyyat və analitika proseslərini vahid platformada birləşdirən
            çevik və təhlükəsiz idarəetmə həlli.
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-background/25 to-transparent z-0" />
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <LoginArea />
        </div>
      </div>
    </div>
  );
}
