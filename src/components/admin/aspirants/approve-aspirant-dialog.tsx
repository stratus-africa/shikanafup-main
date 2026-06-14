
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
import { Aspirant } from "./aspirants-table"

interface ApproveAspirantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    aspirant: Aspirant | null
    onSuccess: () => void
}

export function ApproveAspirantDialog({
    open,
    onOpenChange,
    aspirant,
    onSuccess,
}: ApproveAspirantDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        if (!aspirant) return

        try {
            setLoading(true)
            // Use different endpoints based on type
            const endpoint = aspirant.type === "party"
                ? "/api/party-positions/update-status"
                : "/api/aspirants/update-status"

            await api.patch(endpoint, {
                id: aspirant.id,
                status: "Approved"
            })
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to approve aspirant", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Application</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to approve the application for{" "}
                        <span className="font-semibold">
                            {aspirant?.first_name} {aspirant?.last_name}
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
