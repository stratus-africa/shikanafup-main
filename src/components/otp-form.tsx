"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import toast, { Toaster } from "react-hot-toast"
import api from "@/lib/axios"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { Roles } from "../lib/roles";
import Link from "next/link"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true);
      if (otp.length != 6) {
        toast.error("otp must be six characters")
        return;
      }
      const data = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await api.post("api/users/verify-otp", {
        email: data?.email,
        otp
      }, { validateStatus: () => true });
      setIsLoading(false);
      if (response.data?.statusCode !== 200) {
        toast.error(response.data?.message || "otp validation failed")
        return
      }
      toast.success(response.data?.message);
      if (data?.role_id == '1') {
        router.push("/admin/dashboard")
      }
      else if (data?.role_id == '2') {
        router.push("/shared-ui/political-position")
      }
    } catch (error) {
      setIsLoading(false)
      toast.error("server error");
    }
  }

  const resendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await api.post("api/users/resend-otp", {
        email: data?.email
      }, { validateStatus: () => true });
      setIsLoading(false);
      if (response.data?.statusCode !== 200) {
        toast.error(response.data?.message || "resend otp failed")
        return
      }
      toast.success(response.data?.message);
    } catch (error) {
      setIsLoading(false)
      toast.error("server error");
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}
    >
      <Toaster position="top-right" />
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center p-6 md:p-8"
          >
            <FieldGroup>
              <Field className="items-center text-center">
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to your email
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>

                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  required
                  containerClassName="gap-4"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <FieldDescription className="text-center">
                  Enter the 6-digit code sent to your email.
                </FieldDescription>
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="h-10 w-full bg-secondary hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? <Spinner /> : "Verify"}
                </Button>
                <FieldDescription className="text-center" onClick={resendOtp}>
                  Didn&apos;t receive the code? <Link href="#">Resend</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center">
        By clicking continue, you agree to our <Link href="/shared-ui/terms" className="text-secondary hover:underline">Terms & Conditions</Link>{" "}
        and <Link href="/shared-ui/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}
