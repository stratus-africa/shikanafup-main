
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
    Edit,
    Trash2,
    Users,
    Plus,
} from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { CreateLocalGroupDialog } from "./create-local-group-dialog"
import { EditLocalGroupDialog } from "./edit-local-group-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type LocalGroup = {
    id: number
    county: string
    constituency: string
    leader_names: string
    member_count: number
    created_at: string
}

type SortField = keyof LocalGroup | null
type SortDirection = "asc" | "desc"

export function LocalGroupTable() {
    const [data, setData] = useState<LocalGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState<SortField>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedGroup, setSelectedGroup] = useState<LocalGroup | null>(null)
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const itemsPerPage = 10

    const fetchGroups = async () => {
        try {
            setLoading(true)
            const res = await api.get("/api/local-groups/all")
            setData(Array.isArray(res.data?.data) ? res.data.data : [])
        } catch (err) {
            console.error(err)
            setError("Unable to load local groups")
            // Fallback for demo
            setData([
                { id: 1, county: "Kiambu", constituency: "Ruiru", leader_names: "Nicholas Mutunga", member_count: 15, created_at: "2024-01-01" },
                { id: 2, county: "Nairobi", constituency: "Starehe", leader_names: "James Kirugu", member_count: 42, created_at: "2024-01-05" },
            ])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    const handleDelete = async () => {
        if (!selectedGroup) return
        try {
            await api.delete(`/api/local-groups/delete/${selectedGroup.id}`)
            toast.success("Group deleted successfully")
            fetchGroups()
            setDeleteOpen(false)
        } catch (error) {
            toast.error("Failed to delete group")
        }
    }

    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter((item) => {
            const q = searchTerm.toLowerCase()
            return (
                item.county.toLowerCase().includes(q) ||
                item.constituency.toLowerCase().includes(q) ||
                item.leader_names.toLowerCase().includes(q)
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
                if (typeof aVal === "number" && typeof bVal === "number") {
                    return sortDirection === "asc" ? aVal - bVal : bVal - aVal
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

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search groups..."
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
                            {filteredAndSortedData.length} groups
                        </Badge>
                        <Button onClick={() => setCreateOpen(true)} className="bg-secondary hover:bg-secondary/90 text-white">
                            <Plus className="mr-2 h-4 w-4" /> New Group
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">#</TableHead>
                                <TableHead onClick={() => {
                                    setSortField("county")
                                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                                }} className="cursor-pointer">
                                    County <ArrowUpDown className="inline ml-1 h-3 w-3" />
                                </TableHead>
                                <TableHead onClick={() => {
                                    setSortField("constituency")
                                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                                }} className="cursor-pointer">
                                    Constituency <ArrowUpDown className="inline ml-1 h-3 w-3" />
                                </TableHead>
                                <TableHead>Leader Names</TableHead>
                                <TableHead className="text-center">Members</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No local groups found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <TableRow key={item.id} className="hover:bg-muted/50">
                                        <TableCell className="text-muted-foreground">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                                        <TableCell className="font-medium">{item.county}</TableCell>
                                        <TableCell>{item.constituency}</TableCell>
                                        <TableCell>{item.leader_names}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{item.member_count}</Badge>
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
                                                        // Implement view members logic or navigation
                                                        toast.success(`Viewing members for ${item.constituency}`)
                                                    }}>
                                                        <Users className="mr-2 h-4 w-4" /> View Members
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedGroup(item)
                                                        setEditOpen(true)
                                                    }}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Group
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedGroup(item)
                                                        setDeleteOpen(true)
                                                    }} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Group
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

                {/* Pagination placeholder */}
            </div>

            <CreateLocalGroupDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSuccess={fetchGroups}
            />

            <EditLocalGroupDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                group={selectedGroup}
                onSuccess={fetchGroups}
            />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the local group for {selectedGroup?.constituency}.
                            Membership records for this group will need to be reassigned.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
