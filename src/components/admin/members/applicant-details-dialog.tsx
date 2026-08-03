import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function display(value: any) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return null;
  const s = String(status).toLowerCase();
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        s === "approved" &&
          "border-green-600/30 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
        s === "rejected" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        s === "pending" &&
          "border-amber-600/30 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      )}
    >
      {status}
    </Badge>
  );
}

function Section({
  title,
  rows,
}: {
  title: string;
  rows: [string, any][];
}) {
  return (
    <div className="rounded-md border">
      <div className="border-b bg-muted/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide">
        {title}
      </div>
      <Table>
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell className="w-1/2 py-2 align-top text-xs text-muted-foreground">
                {label}
              </TableCell>
              <TableCell className="py-2 align-top text-sm font-medium break-words">
                {display(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ApplicantDetailsDialog({
  application,
  open,
  onOpenChange,
}: {
  application: any | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const a = application;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            Applicant details
            <StatusBadge status={a?.status} />
          </DialogTitle>
          <DialogDescription>
            {a ? `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim() || a.email : ""}
          </DialogDescription>
        </DialogHeader>

        {!a ? (
          <p className="text-sm text-muted-foreground">
            No application record linked to this member.
          </p>
        ) : (
          <ScrollArea className="max-h-[65vh] pr-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Section
                title="Personal information"
                rows={[
                  ["First name", a.first_name],
                  ["Last name", a.last_name],
                  ["Email", a.email],
                  ["Phone", a.phone],
                  ["Date of birth", a.dob],
                  ["Gender", a.gender],
                  ["ID / Document no.", a.id_no],
                  ["Document type", a.doc_type],
                  ["Religion", a.religion],
                  ["Ethnicity", a.ethnicity],
                ]}
              />
              <Section
                title="Location & IEBC details"
                rows={[
                  ["County", a.county],
                  ["Constituency", a.constituency],
                  ["Ward", a.ward],
                  ["Polling station", a.polling_station],
                  ["Street / Village", a.street_village],
                  ["Postal address", a.postal_address],
                  ["Postal code", a.postal_code],
                  ["Person with disability", a.is_pwd],
                  ["NCPWD number", a.ncpwd_number],
                  ["Local leader", a.local_leader],
                ]}
              />
              <Section
                title="Membership & payment"
                rows={[
                  ["Membership type", a.membership_type],
                  ["Special interest", a.special_interest],
                  ["Payment method", a.payment_method],
                  ["Payment phone", a.payment_phone],
                  ["Amount", a.amount],
                ]}
              />
              <Section
                title="Review trail"
                rows={[
                  ["Status", a.status],
                  ["Submitted", a.created_at ? new Date(a.created_at).toLocaleString() : null],
                  ["Reviewed", a.reviewed_at ? new Date(a.reviewed_at).toLocaleString() : null],
                  ["Rejection reason", a.rejection_reason],
                ]}
              />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
