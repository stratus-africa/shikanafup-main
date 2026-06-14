import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff, writeAudit } from "./_helpers";

export const listContactMessages = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateContactMessage = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["new", "read", "replied", "archived"]),
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, data.status, "contact_messages", data.id, null);
    return { ok: true };
  });

export const deleteContactMessage = createServerFn({ method: "POST" })
  .middleware([requireStaff])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("contact_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "contact_messages", data.id, null);
    return { ok: true };
  });
