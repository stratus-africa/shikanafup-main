
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Search,
    Download,
    CheckCircle,
    XCircle,
    FileText,
    ArrowLeft,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { RejectApplicationDialog } from "./reject-application-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type Application = {
    id: number
    first_name: string
    last_name: string
    phonenumber: string
    email: string
    document: string
    cover_letter: string
    status: string
    created_at: string
}

interface ApplicationsTableProps {
    jobId: string
}

export function ApplicationsTable({ jobId }: ApplicationsTableProps) {
    const [data, setData] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState<keyof Application | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false)

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/api/jobs/applications/${jobId}`)
            const apps = Array.isArray(res.data) ? res.data : res.data?.data || []
            setData(apps)
        } catch (err) {
            console.error(err)
            setError("Failed to load applications")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [jobId])

    const handleSort = (field: keyof Application) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter((app) => {
            const term = searchTerm.toLowerCase()
            return (
                app.first_name?.toLowerCase().includes(term) ||
                app.last_name?.toLowerCase().includes(term) ||
                app.email?.toLowerCase().includes(term) ||
                app.phonenumber?.toLowerCase().includes(term)
            )
        })

        if (sortField) {
            filtered = [...filtered].sort((a, b) => {
                const aVal = a[sortField]
                const bVal = b[sortField]

                if (typeof aVal === "string" && typeof bVal === "string") {
                    return sortDirection === "asc"
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal)
                }
                return 0
            })
        }

        return filtered
    }, [data, searchTerm, sortField, sortDirection])

    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

    const handleApprove = async (id: number) => {
        try {
            await api.patch(`/api/jobs/application-status`, { id, status: "Accepted" })
            toast.success("Application approved")
            fetchApplications()
        } catch (error) {
            toast.error("Failed to approve application")
        }
    }

    const openRejectDialog = (app: Application) => {
        setSelectedApp(app)
        setIsRejectDialogOpen(true)
    }

    const openCoverLetter = (app: Application) => {
        setSelectedApp(app)
        setIsCoverLetterOpen(true)
    }

    const handleExport = () => {
        if (!data.length) return

        const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Status", "Date"]
        const csvContent = [
            headers.join(","),
            ...data.map(app => [
                app.id,
                `"${app.first_name || ''}"`,
                `"${app.last_name || ''}"`,
                `"${app.email || ''}"`,
                `"${app.phonenumber || ''}"`,
                `"${app.status || ''}"`,
                `"${app.created_at || ''}"`
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `applications-${jobId}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-[250px]" />
                <div className="rounded-lg border p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border bg-destructive/10 p-8 text-center text-destructive">
                <p>{error}</p>
                <Button variant="outline" className="mt-4" onClick={fetchApplications}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="-ml-2 h-8 gap-1 pr-3">
                    <Link href="/admin/ui/jobs">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Jobs
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Badge variant="secondary">
                        {filteredAndSortedData.length} Applicants
                    </Badge>
                </div>
            </div>

            <div className="rounded-lg border bg-card overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead onClick={() => handleSort("first_name")} className="cursor-pointer">
                                Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Letter</TableHead>
                            <TableHead className="text-center">Resume</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No applications found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">
                                        {app.first_name} {app.last_name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{app.email}</div>
                                        <div className="text-xs text-muted-foreground">{app.phonenumber}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {app.cover_letter && (
                                            <Button variant="ghost" size="sm" onClick={() => openCoverLetter(app)} title="View Cover Letter">
                                                <FileText className="h-4 w-4 text-primary" />
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {app.document && (
                                            <Button variant="ghost" size="sm" asChild title="Download CV">
                                                <a href={app.document} download target="_blank" rel="noopener noreferrer">
                                                    <Download className="h-4 w-4 text-primary" />
                                                </a>
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            app.status === 'Accepted' ? 'default' :
                                                app.status === 'Rejected' ? 'destructive' : 'secondary'
                                        }>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="bg-primary text-white hover:bg-primary/90"
                                                onClick={() => handleApprove(app.id)}
                                                disabled={app.status === 'Accepted' || app.status === 'Rejected'}
                                                title="Approve"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => openRejectDialog(app)}
                                                disabled={app.status === 'Rejected' || app.status === 'Accepted'}
                                                title="Reject"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <RejectApplicationDialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
                application={selectedApp}
                onSuccess={fetchApplications}
            />

            <Dialog open={isCoverLetterOpen} onOpenChange={setIsCoverLetterOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Cover Letter</DialogTitle>
                        <DialogDescription>
                            From {selectedApp?.first_name} {selectedApp?.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="whitespace-pre-wrap p-4 bg-muted rounded-lg max-h-[60vh] overflow-y-auto">
                        {selectedApp?.cover_letter}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
