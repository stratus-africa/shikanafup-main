"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Spinner } from "./ui/spinner"
import api from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { Roles } from "@/lib/roles";
import { Eye, EyeOff } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardContent } from "./ui/card"

// Define the component's props by omitting the conflicting 'ref' and 'key' properties.
// The rest of the props will now correctly map to standard form attributes.
type LoginFormProps = Omit<React.ComponentProps<"form">, 'ref' | 'key'>;

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const { login } = useAuth()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const isValid = username.trim() !== "" && password.trim() !== ""

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const username = formData.get("username")
      const password = formData.get("password")

      const result = await api.post(
        "/api/users/login",
        { username, password },
        { validateStatus: () => true }

      )

      if (result.data?.statusCode !== 200) {
        toast.error(result.data?.message || "Login failed")
        return
      }
      const { user, token } = result?.data?.data

      // Use context login
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", JSON.stringify(token))
      login(user, token)
      toast.success(result.data?.message || "Login successful")
      const userRole = result.data.data?.user?.role_id;
      if (userRole == 1 || userRole == 3 || userRole == 4) {
        router.push("/admin/dashboard")
        return
      }

      else if (userRole == 2) {
        router.push("/shared-ui/political-position")
        return
      }
      else {
        router.push("/login")
      }

      // router.push("/otp")
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <Toaster position="top-right" />
      <Card>
        <CardContent>
          <form
            onSubmit={handleLogin}
            className={cn("flex flex-col space-y-6", className)}
            {...props}
          >

            <div className="text-center  space-y-3">
              <img
                src="/SFU-LOGO.png"
                alt="Shikana Frontliners for Unity Party"
                className="h-24 mx-auto w-24 object-contain align-center"
              />
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome to SFUP
              </h1>

              <p className="text-sm text-muted-foreground">
                Enter your email/phone number and password to continue
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username *
              </label>
              <Input
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  let val = e.target.value
                  // If it starts with a number and specifically starts with 0, prepend 254
                  if (/^\d/.test(val) && val.startsWith("0")) {
                    val = "254" + val.substring(1)
                  }
                  setUsername(val)
                }}
                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                placeholder="email or phone number (254...)"
              />
            </div>


            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Password *
                </label>

                <a href="/forgot-password" className="text-sm underline-offset-4 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 border-border rounded-lg pr-10 bg-background px-4 transition-colors focus:border-secondary"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>


            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors h-10 mt-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isValid}
            >
              {isLoading ? <Spinner /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}