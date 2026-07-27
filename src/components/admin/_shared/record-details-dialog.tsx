import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DetailField({ label, value }: { label: string; value: any }) {
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : Array.isArray(value)
        ? value.length
          ? value.join(", ")
          : "—"
        : String(value);
  return (
    <div className="space-y-0.5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm break-words">{display}</p>
    </div>
  );
}

export function RecordDetailsDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  status,
  fields,
  wide,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  status?: string | null;
  fields: { label: string; value: any; full?: boolean }[];
  wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide === false ? "sm:max-w-3xl" : "sm:max-w-5xl"}>
        <DialogHeader>
          <DialogTitle>
            {title}
            {status && (
              <Badge
                className="ml-2 align-middle"
                variant={
                  status === "approved"
                    ? "default"
                    : status === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {status}
              </Badge>
            )}
          </DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
              <div key={f.label} className={f.full ? "sm:col-span-2 lg:col-span-3" : undefined}>
                <DetailField label={f.label} value={f.value} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
