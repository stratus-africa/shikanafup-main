
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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import api from "@/lib/axios"

import { CreateAdminUserDialog } from "./create-admin-user-dialog"
import { EditAdminUserDialog } from "./edit-admin-user-dialog"
import { DeleteAdminUserDialog } from "./delete-admin-user-dialog"

export type AdminUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  role_id: number
  Role?: {
    id: number
    role_name: string
  }
}

type SortField = keyof AdminUser | null
type SortDirection = "asc" | "desc"

export function AdminUsersTable() {
  const [data, setData] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const itemsPerPage = 10

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/users/get-all-users")
      const rawData = Array.isArray(res.data?.data) ? res.data.data : []

      // Map backend fields to frontend expected ones
      const mappedData = rawData.map((u: any) => ({
        ...u,
        firstName: u.firstName || u.first_name || "",
        lastName: u.lastName || u.last_name || "",
        role: u.Role?.role_name || u.role || (u.role_id === 1 ? "Admin" : u.role_id === 2 ? "Political Aspirant" : u.role_id === 3 ? "User" : "Unknown"),
        role_id: u.role_id
      }))

      setData(mappedData)
    } catch (err) {
      console.error(err)
      setError("Unable to load admin users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((u) => {
      const q = searchTerm.toLowerCase()
      return (
        (u.firstName?.toLowerCase() || "").includes(q) ||
        (u.lastName?.toLowerCase() || "").includes(q) ||
        (u.email?.toLowerCase() || "").includes(q) ||
        (u.role?.toLowerCase() || "").includes(q)
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

  const handleExport = () => {
    const headers = ["#", "First Name", "Last Name", "Email", "Role"]
    const csv = [
      headers.join(","),
      ...filteredAndSortedData.map((u, i) =>
        [i + 1, u.firstName, u.lastName, u.email, u.role].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `admin-users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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
              placeholder="Search admin users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge className="h-9 px-3">
              {filteredAndSortedData.length}{" "}
              {filteredAndSortedData.length === 1 ? "user" : "users"}
            </Badge>

            <Button variant="outline" size="sm" onClick={handleExport}>
              Export
            </Button>

            <Button onClick={() => setCreateOpen(true)}>
              + New User
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("firstName")}
                  >
                    FirstName
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("lastName")}
                  >
                    LastName
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("role")}
                  >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((user, idx) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{user.firstName}</TableCell>
                    <TableCell className="font-medium">{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="font-medium">{user.role}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setEditOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(user)
                          setDeleteOpen(true)
                        }}
                      >
                        Delete
                      </Button>
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

      {/* DIALOGS */}
      <CreateAdminUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchUsers}
      />

      <EditAdminUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <DeleteAdminUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </>
  )
}
