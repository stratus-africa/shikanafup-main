import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function DataToolbar({
  search,
  onSearch,
  placeholder,
  count,
  children,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder ?? "Search…"}
          className="pl-8"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {typeof count === "number" && (
          <span className="absolute -bottom-5 left-1 text-xs text-muted-foreground">
            {count} result{count === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
