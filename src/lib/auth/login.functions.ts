import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const input = z.object({
  identifier: z.string().trim().min(3).max(255),
  password: z.string().min(1).max(200),
});

function normalizePhone(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("7") || digits.startsWith("1")) return "254" + digits;
  return digits;
}

/**
 * Signs a member in with either an email address or a phone number.
 * Phone numbers are resolved to the account email server-side so that
 * email addresses are never exposed to anonymous callers.
 */
export const signInWithIdentifier = createServerFn({ method: "POST" })
  .inputValidator(input)
  .handler(async ({ data }) => {
    const identifier = data.identifier.trim();
    let email = identifier;

    if (!identifier.includes("@")) {
      const phone = normalizePhone(identifier);
      const variants = Array.from(
        new Set([phone, "+" + phone, "0" + phone.slice(3), identifier]),
      );
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email, phone")
        .in("phone", variants)
        .not("email", "is", null)
        .limit(1)
        .maybeSingle();
      if (!profile?.email) {
        return { error: "No account found for that phone number." } as const;
      }
      email = profile.email;
    }

    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (i, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(i, { ...init, headers: h });
        },
      },
    });

    const { data: session, error } = await client.auth.signInWithPassword({
      email,
      password: data.password,
    });
    if (error || !session.session) {
      return { error: error?.message ?? "Login failed" } as const;
    }
    return {
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    } as const;
  });
