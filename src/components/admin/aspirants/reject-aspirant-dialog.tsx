
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import { Aspirant } from "./aspirants-table"

const formSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
})

interface RejectAspirantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    aspirant: Aspirant | null
    onSuccess: () => void
}

export function RejectAspirantDialog({
    open,
    onOpenChange,
    aspirant,
    onSuccess,
}: RejectAspirantDialogProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!aspirant) return

        try {
            setLoading(true)
            // Use different endpoints based on type
            const endpoint = aspirant.type === "party"
                ? "/api/party-positions/update-status"
                : "/api/aspirants/update-status"

            await api.patch(endpoint, {
                id: aspirant.id,
                status: "Rejected",
                reason: values.reason
            })
            onSuccess()
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error("Failed to reject aspirant", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Application</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting the application for{" "}
                        <span className="font-semibold">
                            {aspirant?.first_name} {aspirant?.last_name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter rejection reason..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive" disabled={loading}>
                                {loading ? "Rejecting..." : "Reject"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
