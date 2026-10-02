import { differenceInMinutes, parseISO, max } from "date-fns";
import {
  TurnaroundTask,
  RiskLevel,
  RiskEvaluationResult,
} from "@/types";

interface CalculateRiskParams {
  tasks: TurnaroundTask[];
  scheduledDeparture: string; // ISO string
  currentReferenceTime?: Date; // Optional reference time (defaults to now)
}

/**
 * Deterministic Operational Risk Engine for Aircraft Turnarounds
 * 
 * Aviation Ground Rule Implementation:
 * 1. Conflict Detection: Critical tasks (Cleaning, Refueling, Baggage Unload) incomplete when Boarding is in progress.
 * 2. Imminent Departure Warning: Scheduled departure within 30 min while critical tasks remain delayed/pending.
 * 3. Dynamic Critical Path: Estimated departure calculated based on completion times of pending tasks.
 */
export function calculateTurnaroundRisk({
  tasks,
  scheduledDeparture,
  currentReferenceTime = new Date(),
}: CalculateRiskParams): RiskEvaluationResult {
  const reasons: string[] = [];
  let riskLevel: RiskLevel = "GREEN";
  let hasOperationalConflict = false;
  let conflictDetails: string | undefined = undefined;

  const schedDepDate = parseISO(scheduledDeparture);
  const minutesUntilDeparture = differenceInMinutes(schedDepDate, currentReferenceTime);

  // Identify specific key tasks
  const refuelingTask = tasks.find((t) => t.type === "REFUELING");
  const boardingTask = tasks.find((t) => t.type === "BOARDING");
  const cleaningTask = tasks.find((t) => t.type === "CABIN_CLEANING");
  const baggageUnloadTask = tasks.find((t) => t.type === "BAGGAGE_UNLOAD");

  // Rule 1: Operational Conflict
  // Boarding cannot safely occur if cleaning is incomplete or refueling is ongoing/delayed without authorization
  const boardingStarted = boardingTask?.status === "IN_PROGRESS" || boardingTask?.status === "COMPLETED";
  const priorCriticalTasksIncomplete = [cleaningTask, baggageUnloadTask].filter(
    (t) => t && t.status !== "COMPLETED"
  );

  if (boardingStarted && priorCriticalTasksIncomplete.length > 0) {
    hasOperationalConflict = true;
    const taskNames = priorCriticalTasksIncomplete.map((t) => t?.title).join(", ");
    conflictDetails = `Boarding active while critical prerequisites are incomplete: ${taskNames}`;
    reasons.push(conflictDetails);
    riskLevel = "RED";
  }

  // Rule 2: Refueling Delay vs Departure Window
  if (refuelingTask && (refuelingTask.status === "DELAYED" || refuelingTask.delayMinutes > 0)) {
    if (minutesUntilDeparture < 30) {
      riskLevel = "RED";
      reasons.push(
        `Refueling delayed by ${refuelingTask.delayMinutes}m with departure in ${minutesUntilDeparture}m (<30m threshold)`
      );
    } else {
      if (riskLevel !== "RED") riskLevel = "AMBER";
      reasons.push(`Refueling delayed by ${refuelingTask.delayMinutes}m`);
    }
  }

  // Rule 3: Any task delayed
  const delayedTasks = tasks.filter((t) => t.status === "DELAYED" || t.delayMinutes > 0);
  if (delayedTasks.length > 0 && reasons.length === 0) {
    if (riskLevel === "GREEN") riskLevel = "AMBER";
    reasons.push(
      `${delayedTasks.length} task(s) currently delayed (${delayedTasks.map((t) => t.title).join(", ")})`
    );
  }

  // Rule 4: Critical task incomplete when departure is imminent (< 15 mins)
  const incompleteCritical = tasks.filter((t) => t.isCritical && t.status !== "COMPLETED");
  if (minutesUntilDeparture < 15 && incompleteCritical.length > 0) {
    riskLevel = "RED";
    reasons.push(
      `Departure imminent in ${minutesUntilDeparture}m with critical tasks pending (${incompleteCritical.map((t) => t.title).join(", ")})`
    );
  }

  // Calculate dynamic Estimated Departure Time (EDT)
  // Max of scheduled departure or latest planned/actual end time of delayed tasks
  let latestTaskFinish = schedDepDate;
  tasks.forEach((t) => {
    const plannedEnd = parseISO(t.plannedEnd);
    // If the task was delayed, the end time shifts by delayMinutes
    const effectiveEndTime = new Date(plannedEnd.getTime() + (t.delayMinutes || 0) * 60 * 1000);
    if (effectiveEndTime > latestTaskFinish) {
      latestTaskFinish = effectiveEndTime;
    }
  });

  const estimatedDelayMinutes = Math.max(0, differenceInMinutes(latestTaskFinish, schedDepDate));

  if (estimatedDelayMinutes > 15 && riskLevel !== "RED") {
    riskLevel = "RED";
    reasons.push(`Projected turnaround delay exceeds 15 minutes (+${estimatedDelayMinutes}m)`);
  } else if (estimatedDelayMinutes > 5 && riskLevel === "GREEN") {
    riskLevel = "AMBER";
    reasons.push(`Projected turnaround delay is +${estimatedDelayMinutes}m`);
  }

  if (reasons.length === 0) {
    reasons.push("All operational milestones on schedule. Normal turnaround window.");
  }

  return {
    riskLevel,
    reasons,
    estimatedDeparture: latestTaskFinish.toISOString(),
    estimatedDelayMinutes,
    hasOperationalConflict,
    conflictDetails,
  };
}
