
import { useEffect, useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import api from "@/lib/axios"

type AuditLog = {
  id: number
  user: string | null
  action: string
  entity: string
  description: string
  ip_address: string
  createdAt: string
}

type SortField = keyof AuditLog | null
type SortDirection = "asc" | "desc"

export function AuditLogsTable() {
  const [data, setData] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await api.get("/api/audit/all")
        const logsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []
        setData(logsArray)
      } catch (err) {
        console.error(err)
        setError("Failed to load audit logs")
      } finally {
        setLoading(false)
      }
    }
    fetchAuditLogs()
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
    if (!Array.isArray(data)) return []

    let filtered = data.filter((log) => {
      const term = searchTerm.toLowerCase()
      const userName = String(log.user || "System")
      return (
        userName.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.entity.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term) ||
        log.ip_address.includes(term)
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
        <Skeleton className="h-5 w-[220px] bg-gray-300" />
        <div className="rounded-lg border p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-gray-300" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-gray-100 p-8 text-center">
        <p className="text-sm font-medium text-gray-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 bg-transparent"
          />
        </div>

        <Badge variant="secondary" className="h-9 px-3">
          {filteredAndSortedData.length} logs
        </Badge>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("user")}
                  className="hover:bg-gray-100"
                >
                  User <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("action")}
                  className="hover:bg-gray-100"
                >
                  Action <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>Entity</TableHead>

              <TableHead>Description</TableHead>

              <TableHead>IP Address</TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("createdAt")}
                  className="hover:bg-gray-100"
                >
                  Time <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((log, idx) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </TableCell>

                  <TableCell>{log.user || "System"}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>

                  <TableCell>{log.entity}</TableCell>

                  <TableCell
                    className="max-w-xs truncate"
                    title={log.description}
                  >
                    {log.description}
                  </TableCell>

                  <TableCell>{log.ip_address}</TableCell>

                  <TableCell>
                    {new Date(log.createdAt).toLocaleString()}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} logs
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
