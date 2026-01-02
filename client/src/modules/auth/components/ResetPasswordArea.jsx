import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordArea() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Şifrəni yenilə</h1>
        <p className="text-sm text-muted-foreground">
          Zəhmət olmasa yeni şifrənizi təyin edin.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
