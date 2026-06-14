
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
    Edit,
} from "lucide-react"
import api from "@/lib/axios"

import { ApproveAspirantDialog } from "./approve-aspirant-dialog"
import { RejectAspirantDialog } from "./reject-aspirant-dialog"
import { UpdateAspirantStatusDialog } from "./update-aspirant-status-dialog"

export type Aspirant = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    membership_number: string
    position: string
    status: string
    type: "political" | "party"
}

type SortField = keyof Aspirant | null
type SortDirection = "asc" | "desc"

interface AspirantsTableProps {
    type: "political" | "party"
}

export function AspirantsTable({ type }: AspirantsTableProps) {
    const [data, setData] = useState<Aspirant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState<SortField>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedAspirant, setSelectedAspirant] = useState<Aspirant | null>(null)
    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)

    const itemsPerPage = 10

    const fetchAspirants = async () => {
        try {
            setLoading(true)

            // Use different endpoints based on type
            const endpoint = type === "party" ? "/api/party-positions/all" : "/api/aspirants/all"
            const res = await api.get(endpoint)
            const rawData = Array.isArray(res.data?.data) ? res.data.data : []

            // Map the data to match the Aspirant type
            const mappedData: Aspirant[] = rawData.map((item: any) => ({
                id: item.id,
                first_name: item.first_name || "",
                last_name: item.last_name || "",
                email: item.email || "",
                phone: item.phone || "",
                membership_number: item.membership_number || "",
                position: item.position || "",
                status: item.status || "Pending",
                type: type,
            }))

            setData(mappedData)
        } catch (err) {
            console.error(err)
            setError("Unable to load aspirants")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAspirants()
    }, [type])

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
                item.first_name.toLowerCase().includes(q) ||
                item.last_name.toLowerCase().includes(q) ||
                item.email.toLowerCase().includes(q) ||
                item.position.toLowerCase().includes(q) ||
                item.membership_number.toLowerCase().includes(q)
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

    /* ---------------- LOADING & ERROR ---------------- */

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

    /* ---------------- RENDER ---------------- */

    return (
        <>
            <div className="space-y-4">
                {/* TOP BAR */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search aspirants..."
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
                            {filteredAndSortedData.length === 1 ? "applicant" : "applicants"}
                        </Badge>
                    </div>
                </div>

                {/* TABLE */}
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
                                        First Name
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSort("last_name")}
                                    >
                                        Last Name
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
                                <TableHead>
                                    Phone
                                </TableHead>
                                <TableHead>
                                    Membership No.
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSort("position")}
                                    >
                                        Position
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
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
                                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                        No aspirants found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-muted-foreground">
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.first_name}</TableCell>
                                        <TableCell className="font-medium">{item.last_name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.phone}</TableCell>
                                        <TableCell>{item.membership_number}</TableCell>
                                        <TableCell className="font-medium">{item.position}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                item.status === 'Approved' ? 'default' :
                                                    item.status === 'Rejected' ? 'destructive' : 'secondary'
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
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedAspirant(item)
                                                        setApproveOpen(true)
                                                    }}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedAspirant(item)
                                                        setRejectOpen(true)
                                                    }} className="text-destructive focus:text-destructive">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedAspirant(item)
                                                        setUpdateOpen(true)
                                                    }}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Update Status
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

                {/* PAGINATION */}
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

            <ApproveAspirantDialog
                open={approveOpen}
                onOpenChange={setApproveOpen}
                aspirant={selectedAspirant}
                onSuccess={fetchAspirants}
            />

            <RejectAspirantDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                aspirant={selectedAspirant}
                onSuccess={fetchAspirants}
            />

            <UpdateAspirantStatusDialog
                open={updateOpen}
                onOpenChange={setUpdateOpen}
                aspirant={selectedAspirant}
                onSuccess={fetchAspirants}
            />
        </>
    )
}
