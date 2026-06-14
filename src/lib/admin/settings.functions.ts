import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, writeAudit } from "./_helpers";

export const listSettings = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase.from("settings").select("*").order("key");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertSetting = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ key: z.string().min(1).max(120), value: z.unknown() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase
      .from("settings")
      .upsert({ key: data.key, value: data.value as any, updated_by: userId }, { onConflict: "key" })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "upsert", "settings", data.key, { value: data.value });
    return row;
  });

export const deleteSetting = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ key: z.string() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("settings").delete().eq("key", data.key);
    if (error) throw new Error(error.message);
    await writeAudit(supabase, userId, "delete", "settings", data.key, null);
    return { ok: true };
  });
