/**
 * Tiny bridge between the app and the live wallpaper.
 * The app says *what happened* ("a result appeared", "the tab changed");
 * the wallpaper decides how the artwork reacts. Nothing else is coupled.
 */
export const AMBIENT_EVENT = "calcredit:ambient";

export type AmbientPing =
  | { kind: "tab"; index: number } // 0 Calculator, 1 Courses, 2 GPA Hub, 3 CGPA Hub
  | { kind: "result" }; // a headline number just changed

export function pingAmbient(ping: AmbientPing): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AmbientPing>(AMBIENT_EVENT, { detail: ping }));
}
