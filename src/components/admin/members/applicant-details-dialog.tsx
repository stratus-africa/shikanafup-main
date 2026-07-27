import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function Field({ label, value }: { label: string; value: any }) {
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
      <p className="text-sm">{display}</p>
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
          <DialogTitle>
            Applicant details
            {a?.status && (
              <Badge
                className="ml-2 align-middle"
                variant={
                  a.status === "approved"
                    ? "default"
                    : a.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {a.status}
              </Badge>
            )}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="First name" value={a.first_name} />
              <Field label="Last name" value={a.last_name} />
              <Field label="Email" value={a.email} />
              <Field label="Phone" value={a.phone} />
              <Field label="Date of birth" value={a.dob} />
              <Field label="Gender" value={a.gender} />
              <Field label="ID / Document no." value={a.id_no} />
              <Field label="Document type" value={a.doc_type} />
              <Field label="County" value={a.county} />
              <Field label="Constituency" value={a.constituency} />
              <Field label="Ward" value={a.ward} />
              <Field label="Polling station" value={a.polling_station} />
              <Field label="Street / Village" value={a.street_village} />
              <Field label="Postal address" value={a.postal_address} />
              <Field label="Postal code" value={a.postal_code} />
              <Field label="Religion" value={a.religion} />
              <Field label="Ethnicity" value={a.ethnicity} />
              <Field label="Person with disability" value={a.is_pwd} />
              <Field label="NCPWD number" value={a.ncpwd_number} />
              <Field label="Membership type" value={a.membership_type} />
              <Field label="Special interest" value={a.special_interest} />
              <Field label="Local leader" value={a.local_leader} />
              <Field label="Payment method" value={a.payment_method} />
              <Field label="Payment phone" value={a.payment_phone} />
              <Field label="Amount" value={a.amount} />
              <Field
                label="Submitted"
                value={a.created_at ? new Date(a.created_at).toLocaleString() : null}
              />
              <Field
                label="Reviewed"
                value={a.reviewed_at ? new Date(a.reviewed_at).toLocaleString() : null}
              />
              <Field label="Rejection reason" value={a.rejection_reason} />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
