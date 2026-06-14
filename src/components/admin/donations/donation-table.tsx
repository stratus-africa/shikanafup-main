
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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react"
import api from "@/lib/axios"
import { AddDonationDialog } from "./add-donation-dialog"
import { exportToCSV } from "@/lib/export-utils"

type Donation = {
  id: number
  firstname?: string
  lastname?: string
  donor_name?: string
  email?: string
  donor_email?: string
  phone?: string
  amount: number
  date: string
  type: string
  is_anonymous?: boolean
  company_name?: string
  organization_name?: string
}

type SortField = keyof Donation | null
type SortDirection = "asc" | "desc"

interface DonationsTableProps {
  type: "individual" | "organization"
}

export function DonationsTable({ type }: DonationsTableProps) {
  const [data, setData] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const fetchData = async () => {
    setLoading(true)
    try {
      const endpoint = type === "organization"
        ? "/api/donations/organization/all"
        : "/api/donations/individual/all"
      const res = await api.get(endpoint)
      const rawData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : []

      // Map backend fields to frontend expectations
      const mappedData: Donation[] = rawData.map((item: any) => ({
        ...item,
        amount: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount,
        email: item.email || item.donor_email || "",
        phone: item.phone || "",
        date: item.date || item.createdAt || new Date().toISOString(),
      }))

      setData(mappedData)
    } catch (err) {
      console.error(err)
      setError("Failed to load donations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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

    let filtered = data.filter((donation) => {
      const term = searchTerm.toLowerCase()
      const searchFields = [
        donation.firstname,
        donation.lastname,
        donation.donor_name,
        donation.email,
        donation.donor_email,
        donation.company_name,
        donation.organization_name,
        donation.phone
      ]

      return searchFields.some(field => field?.toLowerCase().includes(term))
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

  const handleExport = () => {
    const csvData = filteredAndSortedData.map(item => {
      const name = item.is_anonymous
        ? "Anonymous"
        : item.type === 'organization'
          ? (item.company_name || item.organization_name || "N/A")
          : (item.donor_name || `${item.firstname || ''} ${item.lastname || ''}`.trim() || item.email || "N/A");

      return {
        Name: name,
        Email: item.email || item.donor_email || "N/A",
        Phone: item.phone || "N/A",
        Amount: item.amount,
        Date: new Date(item.date).toLocaleDateString()
      }
    })
    exportToCSV(csvData, "donations_export")
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-[220px]" />
        <div className="rounded-lg border p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-destructive/10 p-8 text-center text-destructive">
        <p className="text-sm font-medium">{error}</p>
        <Button variant="outline" onClick={fetchData} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddDonationDialog onSuccess={fetchData} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort(type === 'individual' ? "firstname" : "company_name" as any)}>
                  {type === 'individual' ? "Name" : "Organization Name"} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("amount")}>
                  Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("date")}>
                  Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No donations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((donation) => (
                <TableRow key={donation.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    {donation.is_anonymous ? (
                      <span className="italic text-muted-foreground">Anonymous</span>
                    ) : (
                      <span className="font-medium">
                        {type === 'organization'
                          ? (donation.company_name || donation.organization_name || "N/A")
                          : (donation.donor_name || `${donation.firstname || ''} ${donation.lastname || ''}`.trim() || donation.email || "N/A")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{donation.email || donation.donor_email || "-"}</TableCell>
                  <TableCell>{donation.phone || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(donation.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(donation.date).toLocaleDateString()}
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
            {filteredAndSortedData.length} donations
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
