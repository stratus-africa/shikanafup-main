import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown,
  ArrowUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* sorting + pagination state                                          */
/* ------------------------------------------------------------------ */

export type SortDir = "asc" | "desc";

export function useTableState(defaultSort: string, defaultDir: SortDir = "desc") {
  const [sort, setSort] = React.useState(defaultSort);
  const [dir, setDir] = React.useState<SortDir>(defaultDir);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);

  const toggleSort = React.useCallback(
    (key: string) => {
      setPage(1);
      setSort((prev) => {
        if (prev === key) {
          setDir((d) => (d === "asc" ? "desc" : "asc"));
          return prev;
        }
        setDir("asc");
        return key;
      });
    },
    [],
  );

  return { sort, dir, toggleSort, page, setPage, pageSize, setPageSize };
}

export function sortRows<T>(
  rows: T[],
  key: string,
  dir: SortDir,
  accessor: (row: T, key: string) => unknown,
): T[] {
  const out = [...rows];
  out.sort((a, b) => {
    const av = accessor(a, key);
    const bv = accessor(b, key);
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    let cmp: number;
    if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
    else cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
    return dir === "asc" ? cmp : -cmp;
  });
  return out;
}

export function SortHead({
  label,
  sortKey,
  state,
  className,
}: {
  label: string;
  sortKey: string;
  state: ReturnType<typeof useTableState>;
  className?: string;
}) {
  const active = state.sort === sortKey;
  return (
    <TableHead className={cn("select-none p-0", className)}>
      <button
        type="button"
        onClick={() => state.toggleSort(sortKey)}
        className="flex w-full items-center gap-1 px-2 py-1.5 text-left hover:bg-accent/60"
      >
        <span>{label}</span>
        {active ? (
          state.dir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-30" />
        )}
      </button>
    </TableHead>
  );
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function TablePagination({
  total,
  state,
}: {
  total: number;
  state: ReturnType<typeof useTableState>;
}) {
  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pages);
  const from = total === 0 ? 0 : (page - 1) * state.pageSize + 1;
  const to = Math.min(total, page * state.pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/40 px-2 py-1.5 text-xs">
      <span className="text-muted-foreground">
        Showing {from}–{to} of {total} record{total === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Rows</span>
          <Select
            value={String(state.pageSize)}
            onValueChange={(v) => {
              state.setPageSize(Number(v));
              state.setPage(1);
            }}
          >
            <SelectTrigger className="h-7 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-muted-foreground">
          Page {page} of {pages}
        </span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-7 w-7" disabled={page <= 1} onClick={() => state.setPage(1)} aria-label="First page">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-7 w-7" disabled={page <= 1} onClick={() => state.setPage(page - 1)} aria-label="Previous page">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-7 w-7" disabled={page >= pages} onClick={() => state.setPage(page + 1)} aria-label="Next page">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-7 w-7" disabled={page >= pages} onClick={() => state.setPage(pages)} aria-label="Last page">
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* filter bar                                                          */
/* ------------------------------------------------------------------ */

export function FilterBar({
  search,
  onSearch,
  placeholder,
  onReset,
  hasFilters,
  children,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  onReset?: () => void;
  hasFilters?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end gap-2 border-b bg-muted/40 px-2 py-2">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder ?? "Search…"}
          className="h-8 pl-7 text-xs"
        />
      </div>
      {children}
      {hasFilters && onReset && (
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onReset}>
          <X className="mr-1 h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

export function inDateRange(value: string | null | undefined, from: string, to: string) {
  if (!from && !to) return true;
  if (!value) return false;
  const t = new Date(value).getTime();
  if (from && t < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && t > new Date(`${to}T23:59:59`).getTime()) return false;
  return true;
}
