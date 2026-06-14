import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff } from "./_helpers";

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(z.object({ limit: z.number().int().min(1).max(500).default(200) }).optional())
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    const { data: rows, error } = await supabase
      .from("audit_logs")
      .select("*, actor:profiles(id, full_name, email)")
      .order("created_at", { ascending: false })
      .limit(data?.limit ?? 200);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
