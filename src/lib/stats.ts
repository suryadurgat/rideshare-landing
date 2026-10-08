export type StatTile = {
  id: string;
  value: number;
  label: string;
  floor: number;
  note?: string;
};

const RAW: StatTile[] = [
  { id: "orgs", value: 6, label: "Organisations", floor: 2 },
  { id: "campuses", value: 26, label: "Campuses", floor: 3 },
  { id: "members", value: 139, label: "Verified members", floor: 50 },
  { id: "rides", value: 1, label: "Rides completed", floor: 100 },
  { id: "trips", value: 0, label: "Vehicle trips avoided", floor: 100 },
  {
    id: "co2",
    value: 0,
    label: "CO₂ avoided",
    floor: 250,
    note: "One avoided vehicle trip of 15 km at 0.23 kg/km",
  },
];

export const MIN_VISIBLE_STATS = 3;

export function visibleStats(): StatTile[] {
  return RAW.filter((s) => s.value >= s.floor);
}

export function shouldRenderStats(): boolean {
  return visibleStats().length >= MIN_VISIBLE_STATS;
}
