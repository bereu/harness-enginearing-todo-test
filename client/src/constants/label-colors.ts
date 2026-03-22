// GEN-001: named constants, no magic strings
export const PRESET_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#6B7280", // gray
] as const;

export type PresetColor = (typeof PRESET_COLORS)[number];
