export const PARTY_CODE = "912";

export const MEMBERSHIP_REPORT_COLUMNS = [
  "PARTYCODE",
  "MEMBERSHIPNO",
  "IDNO_PASSPORT_NO",
  "SURNAME",
  "OTHERNAMES",
  "BIRTHDATE",
  "SEX",
  "REGDATE",
  "COUNTYNAME",
  "CONSTITUENCYNAME",
  "WARDNAME",
  "MOBILENO",
  "PWD",
] as const;

export type MembershipReportRow = Record<
  (typeof MEMBERSHIP_REPORT_COLUMNS)[number],
  string
>;

export const fmtDate = (v: string | null | undefined) =>
  v ? new Date(v).toISOString().slice(0, 10) : "";

export const fmtSex = (v: string | null | undefined) => {
  const g = (v ?? "").trim().toLowerCase();
  if (g.startsWith("m")) return "M";
  if (g.startsWith("f")) return "F";
  return g ? g.toUpperCase().slice(0, 1) : "";
};

export const fmtPwd = (v: string | null | undefined) => {
  const s = (v ?? "").trim().toLowerCase();
  return ["yes", "true", "y", "1"].includes(s) ? "Y" : "N";
};

export function toCsv(rows: MembershipReportRow[]) {
  const esc = (v: string) =>
    /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  return [
    MEMBERSHIP_REPORT_COLUMNS.join(","),
    ...rows.map((r) =>
      MEMBERSHIP_REPORT_COLUMNS.map((c) => esc(r[c] ?? "")).join(","),
    ),
  ].join("\n");
}
