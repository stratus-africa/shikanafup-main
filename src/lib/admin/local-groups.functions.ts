import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listLocalGroups = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("local_groups")
      .select("*, leader:profiles(id, full_name, avatar_url)")
      .order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const groupInput = z.object({
  name: z.string().min(1).max(200),
  county: z.string().max(80).optional().nullable(),
  constituency: z.string().max(80).optional().nullable(),
  ward: z.string().max(80).optional().nullable(),
  leader_profile_id: z.string().uuid().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
});

export const createLocalGroup = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(groupInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("local_groups")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "local_groups", row?.id ?? null, { name: data.name });
    return row;
  });

export const updateLocalGroup = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(groupInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("local_groups")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "local_groups", id, patch);
    return row;
  });

export const deleteLocalGroup = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("local_groups").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "local_groups", data.id, null);
    return { ok: true };
  });
