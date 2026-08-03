import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaff } from "./_helpers";
import {
  PARTY_CODE,
  fmtDate,
  fmtPwd,
  fmtSex,
  type MembershipReportRow,
} from "./report-utils";

export const membershipReport = createServerFn({ method: "GET" })
  .middleware([requireStaff])
  .inputValidator(
    z
      .object({
        from: z.string().optional(),
        to: z.string().optional(),
        county: z.string().optional(),
        status: z.string().optional(),
      })
      .optional()
      .default({}),
  )
  .handler(async ({ data, context }): Promise<MembershipReportRow[]> => {
    const { supabase } = context as any;
    let query = supabase
      .from("members")
      .select(
        "id, member_no, status, tier, joined_at, created_at, profile:profiles(full_name,phone,county,constituency,ward,dob,gender,id_number), application:membership_applications(*)",
      )
      .order("created_at", { ascending: false });

    if (data?.from) query = query.gte("created_at", data.from);
    if (data?.to) query = query.lte("created_at", `${data.to}T23:59:59`);
    if (data?.status) query = query.eq("status", data.status);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const mapped: MembershipReportRow[] = (rows ?? [])
      .filter((m: any) => m.application?.status !== "rejected")
      .map((m: any) => {
        const a = m.application ?? {};
        const p = m.profile ?? {};
        const names = (p.full_name ?? "").trim().split(/\s+/).filter(Boolean);
        const surname = a.last_name ?? names.slice(-1)[0] ?? "";
        const others =
          a.first_name ??
          (names.length > 1 ? names.slice(0, -1).join(" ") : "");
        return {
          PARTYCODE: PARTY_CODE,
          MEMBERSHIPNO: m.member_no ?? "",
          IDNO_PASSPORT_NO: a.id_no ?? p.id_number ?? "",
          SURNAME: surname,
          OTHERNAMES: others,
          BIRTHDATE: fmtDate(a.dob ?? p.dob),
          SEX: fmtSex(a.gender ?? p.gender),
          REGDATE: fmtDate(m.joined_at ?? m.created_at),
          COUNTYNAME: a.county ?? p.county ?? "",
          CONSTITUENCYNAME: a.constituency ?? p.constituency ?? "",
          WARDNAME: a.ward ?? p.ward ?? "",
          MOBILENO: a.phone ?? p.phone ?? "",
          PWD: fmtPwd(a.is_pwd),
        };
      });

    const county = data?.county?.trim().toLowerCase();
    return county
      ? mapped.filter(
          (r: MembershipReportRow) => r.COUNTYNAME.toLowerCase() === county,
        )
      : mapped;
  });
