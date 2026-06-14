
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { VolunteerData } from "./volunteer-table"
import toast from "react-hot-toast"

interface ApproveVolunteerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    volunteer: VolunteerData | null
    onSuccess: () => void
}

export function ApproveVolunteerDialog({
    open,
    onOpenChange,
    volunteer,
    onSuccess,
}: ApproveVolunteerDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        if (!volunteer) return

        try {
            setLoading(true)
            await api.patch(`/api/volunteers/update-status`, { id: volunteer.id, status: "approved" })
            toast.success("Volunteer application approved")
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to approve volunteer", error)
            toast.error("Failed to approve volunteer")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Volunteer Application</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to approve the application for{" "}
                        <span className="font-semibold">
                            {volunteer?.first_name + " " + volunteer?.last_name}
                        </span>
                        ?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={loading}>
                        {loading ? "Approving..." : "Approve"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
