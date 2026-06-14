import React from "react";
import { LucideIcon } from "lucide-react";

interface ProfessionalEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function ProfessionalEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: ProfessionalEmptyStateProps) {
  return (
    <div className="w-full py-12 flex justify-center items-center">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
