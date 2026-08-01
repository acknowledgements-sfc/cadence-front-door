/**
 * Scripted Midnight-EP altitude fixtures for P-2.
 * Altitude discipline is a ship-gate:
 * - Map: health dots only — never % handled
 * - Line: Movements + handled-effort — never task panels
 * - Detail: one Movement's blocking truth
 * - Task: Status + one dep thread only when it speaks
 */

export type AltitudeId = "map" | "line" | "detail" | "task";

export const ALTITUDE_ORDER: AltitudeId[] = ["map", "line", "detail", "task"];

export const TAB_HOLD_MS = 4000;

/** Map frame — six-line cast, health only. No % handled. */
export const MAP_LINES = [
  { id: "album", name: "Album", health: "ok" as const, y: 14 },
  { id: "albumPush", name: "Album push", health: "ok" as const, y: 28 },
  { id: "tour", name: "Tour", health: "tight" as const, y: 44 },
  { id: "loop", name: "Live-show ideas", health: "ok" as const, y: 58 },
  { id: "single", name: "Single", health: "ok" as const, y: 72 },
  { id: "singlePush", name: "Single push", health: "ok" as const, y: 86 },
];

/** Line frame — Midnight EP Movements. Health + handled effort. No task panels. */
export const LINE_MOVEMENTS = [
  { id: "keys", name: "Track keys", date: "Aug 1", health: "ok" as const, handled: "held" as const },
  {
    id: "mix-vocals",
    name: "Mix vocals",
    date: "Aug 10",
    health: "tight" as const,
    handled: "open" as const,
    focus: true,
  },
  {
    id: "mix-instr",
    name: "Mix instruments",
    date: "Aug 12",
    health: "tight" as const,
    handled: "open" as const,
  },
  {
    id: "mastering",
    name: "Book mastering",
    date: "Aug 16",
    health: "ok" as const,
    handled: "waiting" as const,
  },
];

export const LINE_EYEBROW = "Midnight EP · Production";

/** Detail frame — one Movement with blocking set. */
export const DETAIL_FIXTURE = {
  crumb: "Midnight EP · Production",
  title: "Mix vocals",
  meta: "Planned · Aug 10",
  blocking: "Waiting on final vocal take.",
  atRisk: "Mix instruments and Book mastering hold until this clears.",
};

/** Task frame — Status always; one dep thread. */
export const TASK_FIXTURE = {
  name: "Mix vocals",
  date: "Aug 10",
  status: "Open",
  dep: {
    label: "Depends on",
    name: "Final vocal take",
    state: "Waiting",
  },
};
