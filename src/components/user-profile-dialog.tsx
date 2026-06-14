
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "@/lib/next-shims"
import { User, Mail, Phone, Shield, LayoutDashboard } from "lucide-react"

const STAFF_ROLES = ["super_admin", "admin", "editor", "moderator"]

interface UserProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
    const { user, logout } = useAuth()
    const router = useRouter()

    if (!user) return null

    const isStaff = STAFF_ROLES.includes((user.role ?? "").toString())

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">My Profile</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-secondary">
                            {user.first_name?.[0]}{user.last_name?.[0] || user.username?.[0]}
                        </span>
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold">
                            {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>

                    <div className="w-full space-y-3 mt-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Mail className="text-secondary h-4 w-4" />
                            <span className="text-sm">{user.email}</span>
                        </div>

                        {user.phone && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Phone className="text-secondary h-4 w-4" />
                                <span className="text-sm">{user.phone}</span>
                            </div>
                        )}

                        {/* {user.role_id && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Shield className="text-secondary h-4 w-4" />
                                <span className="text-sm capitalize">Role ID: {user.role_id}</span>
                            </div>
                        )} */}
                    </div>

                    {isStaff && (
                        <Button
                            className="w-full mt-4 bg-primary hover:bg-[#9a181c] text-white"
                            onClick={() => {
                                onOpenChange(false)
                                router.push("/admin/dashboard")
                            }}
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Open Admin Portal
                        </Button>
                    )}

                    <Button
                        variant="destructive"
                        className="w-full mt-2"
                        onClick={() => {
                            onOpenChange(false)
                            logout()
                        }}
                    >
                        Log Out
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
