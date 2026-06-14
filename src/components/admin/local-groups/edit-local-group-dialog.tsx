
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import toast from "react-hot-toast"

const formSchema = z.object({
    county: z.string().min(1, "County is required"),
    constituency: z.string().min(1, "Constituency is required"),
    leader_names: z.string().min(1, "Leader names are required"),
})

interface EditLocalGroupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    group: any | null
    onSuccess: () => void
}

export function EditLocalGroupDialog({
    open,
    onOpenChange,
    group,
    onSuccess,
}: EditLocalGroupDialogProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            county: "",
            constituency: "",
            leader_names: "",
        },
    })

    useEffect(() => {
        if (group) {
            form.reset({
                county: group.county || "",
                constituency: group.constituency || "",
                leader_names: group.leader_names || "",
            })
        }
    }, [group, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!group) return
        try {
            setLoading(true)
            await api.patch(`/api/local-groups/update/${group.id}`, values)
            toast.success("Local group updated successfully")
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            console.error("Failed to update group", error)
            toast.error(error.response?.data?.message || "Failed to update group")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Local Group</DialogTitle>
                    <DialogDescription>
                        Update the details for this local party group.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="county"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>County</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Kiambu" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="constituency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Constituency</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Ruiru" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="leader_names"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leader Names</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. John Doe, Jane Smith" {...field} />
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
                            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90 text-white">
                                {loading ? "Updating..." : "Update Group"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
