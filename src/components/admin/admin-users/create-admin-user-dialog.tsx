
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateAdminUserDialog({ open, onOpenChange, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/api/users/roles")
        setRoles(response.data.data)
      } catch (err) {
        setRoles([])
        console.error("Failed to fetch roles", err)
      }
    }

    if (open) {
      fetchRoles()
    }
  }, [open])

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email) {
      toast.error("All fields are required")
      return
    }

    try {
      setLoading(true)
      const response = await api.post("/api/users/register", form)

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data?.message || "User created successfully")
        onSuccess()
        onOpenChange(false)
        setForm({ first_name: "", last_name: "", email: "", role_id: "" })
      } else {
        toast.error(response.data?.message || "Failed to create user")
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to create user"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <Dialog
        open={open}
        onOpenChange={loading ? () => { } : onOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="First name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />
            <Input
              placeholder="Last name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <Select
              value={form.role_id}
              onValueChange={(value) => setForm({ ...form, role_id: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.length > 0 && roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role?.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
