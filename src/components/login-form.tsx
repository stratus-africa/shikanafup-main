import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "@/lib/next-shims"
import { useState } from "react"
import { Spinner } from "./ui/spinner"
import { supabase } from "@/integrations/supabase/client"
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
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const isValid = username.trim() !== "" && password.trim() !== ""

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const email = username.trim()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.session || !data.user) {
        toast.error(error?.message || "Login failed")
        return
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)

      const roleList = (roles ?? []).map((r: any) => r.role as string)
      const isStaff = roleList.some((r) =>
        ["super_admin", "admin", "editor", "moderator"].includes(r),
      )

      const userObj = {
        id: data.user.id,
        username: data.user.email ?? "",
        email: data.user.email ?? "",
        role: roleList[0] ?? "member",
      }

      login(userObj, data.session.access_token)
      toast.success("Login successful")

      if (isStaff) {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
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
                Enter your email and password to continue
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                placeholder="you@example.com"
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