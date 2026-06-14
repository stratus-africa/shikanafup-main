import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/forgot-password";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — SFUP" },
      { name: "description", content: "Request a password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="min-h-svh flex flex-col items-end justify-center gap-6 p-6 md:p-10 bg-[url('/Sfu-login-bg.avif')] bg-cover bg-center bg-no-repeat">
      <div className="hidden md:block absolute left-9 top-1/3 max-w-md text-white space-y-4 md:left-16">
        <h2 className="text-4xl font-bold drop-shadow-lg">Trouble Logging In?</h2>
        <p className="text-lg drop-shadow-md">
          Don't worry. Enter your registered email below and we'll send you a
          secure link to reset your password.
        </p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6 md:mr-28">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
