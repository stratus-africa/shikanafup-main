import { Check, Clock, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected" | "withdrawn" | string;

const STEPS = [
  { key: "submitted", label: "Submitted", icon: Check },
  { key: "review", label: "Under review", icon: Search },
  { key: "decision", label: "Decision", icon: Clock },
];

function fmt(d?: string | null) {
  return d ? new Date(d).toLocaleDateString() : undefined;
}

export function ApplicationTimeline({
  status,
  createdAt,
  reviewedAt,
  notes,
}: {
  status: Status;
  createdAt?: string | null;
  reviewedAt?: string | null;
  notes?: string | null;
}) {
  const decided = status === "approved" || status === "rejected" || status === "withdrawn";
  const reached = (i: number) => (i === 0 ? true : i === 1 ? Boolean(reviewedAt) || decided : decided);

  return (
    <div className="mt-3 space-y-3">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-0">
        {STEPS.map((step, i) => {
          const active = reached(i);
          const isDecision = i === 2;
          const Icon = isDecision && status === "rejected" ? X : step.icon;
          const date =
            i === 0 ? fmt(createdAt) : i === 2 && decided ? fmt(reviewedAt) : undefined;
          return (
            <li key={step.key} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="flex items-center gap-0 sm:w-full">
                <div className="hidden flex-1 sm:block">
                  {i > 0 && (
                    <div className={cn("h-0.5 w-full", active ? "bg-primary" : "bg-border")} />
                  )}
                </div>
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border",
                    active
                      ? isDecision && status === "rejected"
                        ? "border-destructive bg-destructive text-destructive-foreground"
                        : "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="hidden flex-1 sm:block">
                  {i < STEPS.length - 1 && (
                    <div className={cn("h-0.5 w-full", reached(i + 1) ? "bg-primary" : "bg-border")} />
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium">
                  {isDecision && decided
                    ? status.charAt(0).toUpperCase() + status.slice(1)
                    : step.label}
                </p>
                {date && <p className="text-[11px] text-muted-foreground">{date}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      {notes && (
        <p className="rounded-md bg-muted/60 p-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Reviewer note: </span>
          {notes}
        </p>
      )}
    </div>
  );
}
