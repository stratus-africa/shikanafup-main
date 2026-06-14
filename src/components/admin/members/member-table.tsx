
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Download,
  Mail,
  PhoneIcon,
} from "lucide-react"
import api from "@/lib/axios"
import { ViewMemberDialog } from "./view-member"

type Member = {
  id: number
  first_name: string
  last_name: string
  member_code: string
  county: string
  email: string
  phone: string
  status: "ACTIVE" | "INACTIVE"
  constituency?: string
  ward?: string
  dob?: string
  gender?: string
  specialInterest?: string
}

type SortField = keyof Member | null
type SortDirection = "asc" | "desc"

export function MembersTable() {
  const [data, setData] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  


  const itemsPerPage = 10

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/api/members/get/all")
        setData(Array.isArray(res.data?.data) ? res.data.data : [])
      } catch (err) {
        console.error(err)
        setError("Unable to load members")
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
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
    let filtered = data.filter((m) => {
      const q = searchTerm.toLowerCase()
      return (
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        m.member_code.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(searchTerm)
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
    const headers = [
      "First Name",
      "Last Name",
      "Member No",
      "County",
      "Email",
      "Phone",
      "Status",
    ]

    const csv = [
      headers.join(","),
      ...filteredAndSortedData.map((m) =>
        [
          m.first_name,
          m.last_name,
          m.member_code,
          m.county,
          m.email,
          m.phone,
          m.status,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `members-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-3">
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
        {/* TOP BAR */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
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
              {filteredAndSortedData.length === 1 ? "member" : "Members"}
            </Badge>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
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
                  <Button variant="ghost" size="sm" onClick={() => handleSort("first_name")}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Member No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((m, idx) => (
                  <TableRow key={m.id} className="hover:bg-muted/50">
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {m.first_name} {m.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {m.member_code}
                      </Badge>
                    </TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={m.status === "ACTIVE" ? "default" : "secondary"}
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedMember(m); setViewOpen(true); }} >
                        <Eye className="h-4 w-4" />
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
          <div className="flex justify-end gap-2">
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
        )}
      </div>

      {/* VIEW MEMBER DIALOG */}
      <ViewMemberDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        member={selectedMember}
      />

    </>
  )
}
