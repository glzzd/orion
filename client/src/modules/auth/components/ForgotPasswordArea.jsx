import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordArea = () => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Şifrənizi unutmusunuz?</h1>
        <p className="text-sm text-muted-foreground">
          E-poçt ünvanınızı daxil edin, biz sizə şifrə sıfırlama linki göndərək.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordArea;
