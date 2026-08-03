import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "@/lib/next-shims"
import { useState } from "react"
import { Spinner } from "./ui/spinner"
import { supabase } from "@/integrations/supabase/client"
import { lovable } from "@/integrations/lovable"
import { signInWithIdentifier } from "@/lib/auth/login.functions"
import { useAuth } from "@/context/auth-context"
import { Eye, EyeOff } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'
import { Card, CardContent } from "./ui/card"

type LoginFormProps = Omit<React.ComponentProps<"form">, 'ref' | 'key'>;

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const { login } = useAuth()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const isValid = username.trim() !== "" && password.trim() !== ""

  const routeAfterLogin = async (userId: string, email: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)

    const roleList = (roles ?? []).map((r: any) => r.role as string)
    const isStaff = roleList.some((r) =>
      ["super_admin", "admin", "editor", "moderator"].includes(r),
    )

    login(
      { id: userId, username: email, email, role: roleList[0] ?? "member" },
      "",
    )
    toast.success("Login successful")
    router.push(isStaff ? "/admin/dashboard" : "/portal")
  }

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      })
      if ((result as any).error) {
        toast.error((result as any).error.message ?? "Google sign-in failed")
        return
      }
      if ((result as any).redirected) return
      const { data } = await supabase.auth.getUser()
      if (data.user) await routeAfterLogin(data.user.id, data.user.email ?? "")
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result: any = await signInWithIdentifier({
        data: { identifier: username.trim(), password },
      })

      if (result?.error || !result?.access_token) {
        toast.error(result?.error || "Login failed")
        return
      }

      const { data, error } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      })

      if (error || !data.user) {
        toast.error(error?.message || "Login failed")
        return
      }

      await routeAfterLogin(data.user.id, data.user.email ?? "")
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred")
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

            <div className="text-center  space-y-3">
              <img
                src="/SFU-LOGO.png"
                alt="Shikana Frontliners for Unity Party"
                className="h-24 mx-auto w-24 object-contain align-center"
              />
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome to SFUP
              </h1>

              <p className="text-sm text-muted-foreground">
                Enter your email or phone number and password to continue
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email or Phone *
              </label>
              <Input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                placeholder="you@example.com or 0712345678"
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

            <div className="relative text-center">
              <span className="bg-card px-2 text-xs text-muted-foreground relative z-10">
                OR
              </span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={isGoogleLoading}
              className="w-full h-10 flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? <Spinner /> : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                    <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
                    <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.14 6.16-4.14Z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              New member?{" "}
              <a href="/register" className="underline underline-offset-4">
                Register here
              </a>
            </p>

          </form>
        </CardContent>
      </Card>
    </>
  );
}