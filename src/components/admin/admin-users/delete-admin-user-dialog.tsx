
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { AdminUser } from "./admin-users"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
  onSuccess: () => void
}

export function DeleteAdminUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: Props) {
  if (!user) return null

  const handleDelete = async () => {
    try {
      await api.delete(`/api/users/delete/${user.id}`)
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      alert("Failed to delete user")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Admin User</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <b>{user.firstName + " " + user.lastName}</b>?  
          This action cannot be undone.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
