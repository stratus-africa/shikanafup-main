
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Briefcase,
    FileText,
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

type AddJobProps = {
    onSuccess?: () => void
    initialData?: any
    mode?: "add" | "edit" | "view"
}

export default function AddJob({ onSuccess, initialData, mode = "add" }: AddJobProps) {
    const isView = mode === "view"
    const isEdit = mode === "edit"

    const [formData, setFormData] = useState({
        job_title: initialData?.job_title || initialData?.title || "",
        description: initialData?.description || "",
    })

    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (initialData) {
            setFormData({
                job_title: initialData.job_title || initialData.title || "",
                description: initialData.description || "",
            })
        }
    }, [initialData])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async () => {
        if (!formData.job_title || !formData.description) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            setSubmitting(true)

            const payload: any = {
                job_title: formData.job_title,
                description: formData.description,
            }

            let response;
            if (isEdit) {
                payload.id = initialData.id
                payload.status = initialData.status || "active"
                response = await api.patch("/api/jobs/update", payload)
            } else {
                response = await api.post("/api/jobs/add", payload)
            }

            if (
                response.data?.message === "Job created successfully" ||
                response.data?.message === "Job updated successfully" ||
                response.data?.statusCode === 200 ||
                response.data?.statusCode === 201
            ) {
                toast.success(response.data.message || (isEdit ? "Job updated" : "Job posted"))
                onSuccess?.()
            } else {
                toast.error(response.data.message || "Operation failed")
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="w-full px-1">
            <div className="pb-4 mb-6 border-b">
                <h2 className="text-2xl font-semibold">
                    {isView ? "Job Details" : isEdit ? "Update Job" : "Create New Job"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {isView ? "Information about this job opening" : "Fill in the details below to manage the job listing"}
                </p>
            </div>

            <div className="space-y-6 pb-4">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Job Title
                    </Label>
                    <Input
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        readOnly={isView}
                        placeholder="e.g. Senior Software Engineer"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                    </Label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        readOnly={isView}
                        className="min-h-[250px]"
                        placeholder="Describe the roles, responsibilities, and requirements..."
                    />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                    {!isView ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setFormData({
                                        job_title: initialData?.job_title || initialData?.title || "",
                                        description: initialData?.description || "",
                                    })
                                }}
                                disabled={submitting}
                            >
                                Reset
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Processing..." : isEdit ? "Update Job" : "Create Job"}
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={onSuccess}>Close</Button>
                    )}
                </div>
            </div>
        </div>
    )
}
