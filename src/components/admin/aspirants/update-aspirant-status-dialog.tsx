
import { useState, useEffect } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { Aspirant } from "./aspirants-table"

const formSchema = z.object({
    status: z.string().min(1, "Status is required"),
})

interface UpdateAspirantStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    aspirant: Aspirant | null
    onSuccess: () => void
}

export function UpdateAspirantStatusDialog({
    open,
    onOpenChange,
    aspirant,
    onSuccess,
}: UpdateAspirantStatusDialogProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "",
        },
    })

    useEffect(() => {
        if (aspirant) {
            form.setValue("status", aspirant.status)
        }
    }, [aspirant, form])

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
                status: values.status
            })
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update status", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Status</DialogTitle>
                    <DialogDescription>
                        Update the status for{" "}
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                            <SelectItem value="Under Review">Under Review</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            <Button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
