import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInMinutes, parseISO } from "date-fns";

/**
 * Merges Tailwind classes cleanly with conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a Date or ISO string to HH:mm (24-hour operational format)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm");
}

/**
 * Format a Date or ISO string to full operational timestamp (e.g. 02 Oct 14:30)
 */
export function formatOperationalDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM HH:mm");
}

/**
 * Calculate delay in minutes between scheduled/planned time and actual/estimated time.
 * Returns positive number for delays, 0 for on-time or early.
 */
export function calculateDelayMinutes(
  planned: Date | string,
  actualOrEstimated: Date | string
): number {
  const p = typeof planned === "string" ? parseISO(planned) : planned;
  const a = typeof actualOrEstimated === "string" ? parseISO(actualOrEstimated) : actualOrEstimated;
  const diff = differenceInMinutes(a, p);
  return diff > 0 ? diff : 0;
}
