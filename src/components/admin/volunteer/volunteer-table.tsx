
import { useEffect, useState, useMemo } from "react"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    MoreHorizontal,
    CheckCircle,
    XCircle,
} from "lucide-react"
import api from "@/lib/axios"

import { ApproveVolunteerDialog } from "./approve-volunteer-dialog"
import { RejectVolunteerDialog } from "./reject-volunteer-dialog"

export type VolunteerData = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    areas_of_interest: string[]
    volunteer_type: "event" | "general"
    event_id?: number
    event_name?: string
    status: string,
    created_at: string
}

type SortField = keyof VolunteerData | null
type SortDirection = "asc" | "desc"

interface VolunteerTableProps {
    eventId?: number
}

export function VolunteerTable({ eventId }: VolunteerTableProps) {
    const [data, setData] = useState<VolunteerData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState<SortField>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerData | null>(null)
    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)

    const itemsPerPage = 10

    const fetchVolunteers = async () => {
        try {
            setLoading(true)
            const endpoint = eventId ? `/api/volunteers/event/${eventId}` : "/api/volunteers/all"
            const res = await api.get(endpoint)
            setData(Array.isArray(res.data?.data) ? res.data.data : [])
        } catch (err) {
            console.error(err)
            setError("Unable to load volunteers")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVolunteers()
    }, [eventId])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter((item) => {
            const q = searchTerm.toLowerCase()
            return (
                item.first_name?.toLowerCase().includes(q) ||
                item.last_name?.toLowerCase().includes(q) ||
                item.email?.toLowerCase().includes(q) ||
                item.phone?.toLowerCase().includes(q) ||
                item.event_name?.toLowerCase().includes(q)
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

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-gray-300" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border bg-gray-100 p-6 text-center text-sm">
                {error}
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search volunteers..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-9 bg-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-9 px-3">
                            {filteredAndSortedData.length}{" "}
                            {filteredAndSortedData.length === 1 ? "volunteer" : "volunteers"}
                        </Badge>
                    </div>
                </div>

                <div className="rounded-lg border bg-card overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">#</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSort("first_name")}
                                    >
                                        Full Name
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSort("email")}
                                    >
                                        Email
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                        No volunteers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-muted-foreground">
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.first_name + " " + item.last_name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.phone}</TableCell>
                                        <TableCell className="capitalize">{item.volunteer_type}</TableCell>
                                        <TableCell>{item.event_name || "N/A"}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                item.status === 'approved' ? 'default' :
                                                    item.status === 'rejected' ? 'destructive' : 'secondary'
                                            }>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        disabled={item.status === 'approved'}
                                                        onClick={() => {
                                                            setSelectedVolunteer(item)
                                                            setApproveOpen(true)
                                                        }}
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        disabled={item.status === 'rejected'}
                                                        onClick={() => {
                                                            setSelectedVolunteer(item)
                                                            setRejectOpen(true)
                                                        }}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}{" "}
                            of {filteredAndSortedData.length} results
                        </p>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ApproveVolunteerDialog
                open={approveOpen}
                onOpenChange={setApproveOpen}
                volunteer={selectedVolunteer}
                onSuccess={fetchVolunteers}
            />

            <RejectVolunteerDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                volunteer={selectedVolunteer}
                onSuccess={fetchVolunteers}
            />
        </>
    )
}
