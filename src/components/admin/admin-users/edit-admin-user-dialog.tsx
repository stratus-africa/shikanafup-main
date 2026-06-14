
import { useEffect, useState } from "react"
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
import { AdminUser } from "./admin-users"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
  onSuccess: () => void
}

export function EditAdminUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<{ id: string | number; role_name: string }[]>([])
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
        console.error("Failed to fetch roles", err)
      }
    }

    if (open) {
      fetchRoles()
    }
  }, [open])

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role_id: user.role_id?.toString() || ""
      })
    }
  }, [user])

  if (!user) return null

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const response = await api.patch(`/api/users/update/${user.id}`, form)

      if (response.status === 200) {
        toast.success(response.data?.message || "User updated successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(response.data?.message || "Failed to update user")
      }
    } catch (err: any) {
      console.error(err)
      const message = err?.response?.data?.message || err?.message || "Failed to update user"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    {role.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
