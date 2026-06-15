// Kenya administrative divisions per IEBC: 47 counties, 290 constituencies, 1,448 wards.
// Source: ericgichuri/kenya-counties-constituencies-wards (credit: Infotrak), aligned with IEBC.
import raw from "./raw.json";

export interface Ward {
  id: string;
  name: string;
}
export interface Constituency {
  id: string;
  name: string;
  wards: Ward[];
}
export interface County {
  id: number;
  name: string;
  constituencies: Constituency[];
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const KENYA_COUNTIES: County[] = (raw as any).counties.map((c: any) => {
  const constituencies: Constituency[] = [];
  for (const cobj of c.Constituency ?? []) {
    for (const [cname, wards] of Object.entries(cobj as Record<string, string[]>)) {
      constituencies.push({
        id: `${c.No}-${slug(cname)}`,
        name: cname,
        wards: (wards as string[]).map((w) => ({
          id: `${c.No}-${slug(cname)}-${slug(w)}`,
          name: w,
        })),
      });
    }
  }
  return { id: c.No as number, name: c.Name as string, constituencies };
});

export const findCounty = (name: string) =>
  KENYA_COUNTIES.find((c) => c.name === name);

export const findConstituency = (countyName: string, constituencyName: string) =>
  findCounty(countyName)?.constituencies.find((x) => x.name === constituencyName);

export const getConstituencies = (countyName: string) =>
  findCounty(countyName)?.constituencies ?? [];

export const getWards = (countyName: string, constituencyName: string) =>
  findConstituency(countyName, constituencyName)?.wards ?? [];
