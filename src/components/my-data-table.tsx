"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  className?: string
}

interface DataTableProps {
  title?: string
  columns: Column[]
  data: Record<string, any>[]
  onView?: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  rowsPerPage?: number
}

export function DataTable({
  title = "Data Table",
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  rowsPerPage = 5,
}: DataTableProps) {
  const [page, setPage] = React.useState(1)

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = data.slice(startIndex, endIndex)

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn("font-semibold text-sm", col.className)}
                >
                  {col.label}
                </TableHead>
              ))}
              {(onView || onEdit || onDelete) && (
                <TableHead className="text-right w-[160px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
                      {row[col.key]}
                    </TableCell>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {onView && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(row)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(row)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
