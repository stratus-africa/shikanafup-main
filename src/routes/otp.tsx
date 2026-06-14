import { createFileRoute } from "@tanstack/react-router";
import { OTPForm } from "@/components/otp-form";

export const Route = createFileRoute("/otp")({
  head: () => ({
    meta: [
      { title: "Verify OTP — SFUP" },
      { name: "description", content: "Enter the one-time passcode to continue." },
    ],
  }),
  component: OTPPage,
});

function OTPPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <OTPForm />
      </div>
    </div>
  );
}
