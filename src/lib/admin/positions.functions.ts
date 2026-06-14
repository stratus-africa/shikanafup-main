import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

// ===== Political Positions =====
export const listPoliticalPositions = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("political_positions")
      .select("*")
      .order("title");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const polInput = z.object({
  title: z.string().min(1).max(200),
  level: z.enum(["national", "county", "constituency", "ward"]),
  description: z.string().max(5000).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const createPoliticalPosition = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(polInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("political_positions")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "political_positions", row?.id ?? null, data);
    return row;
  });

export const updatePoliticalPosition = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(polInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("political_positions")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "political_positions", id, patch);
    return row;
  });

export const deletePoliticalPosition = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("political_positions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "political_positions", data.id, null);
    return { ok: true };
  });

// ===== Party Positions =====
export const listPartyPositions = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("party_positions")
      .select("*")
      .order("title");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const partyInput = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const createPartyPosition = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(partyInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("party_positions")
      .insert(data)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "create", "party_positions", row?.id ?? null, data);
    return row;
  });

export const updatePartyPosition = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(partyInput.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { id, ...patch } = data;
    const { data: row, error } = await supabase
      .from("party_positions")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "update", "party_positions", id, patch);
    return row;
  });

export const deletePartyPosition = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("party_positions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "party_positions", data.id, null);
    return { ok: true };
  });
