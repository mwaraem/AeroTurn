/**
 * AeroTurn Domain Model & Operational Types
 * 
 * Defines the real-world operational domain for turnaround handling,
 * flight dispatch, ground handling task sequences, incidents, and deterministic risk evaluations.
 */

export type UserRole = "OPS_MANAGER" | "OPS_AGENT" | "VIEWER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Airport {
  id: string;
  code: string; // IATA (e.g. NBO, MBA, KIS, EBB)
  name: string; // e.g. Jomo Kenyatta International Airport
  city: string;
  country: string;
  timezone: string;
}

export interface Aircraft {
  id: string;
  registration: string; // e.g. 5Y-KQA
  model: string; // e.g. Boeing 737-800, Embraer E190, ATR 72-600
  capacity: number; // Passenger seats
  airline: string; // e.g. Kenya Airways, Jambojet
}

export type FlightStatus =
  | "SCHEDULED"
  | "ON_TIME"
  | "BOARDING"
  | "DEPARTED"
  | "ARRIVED"
  | "DELAYED"
  | "CANCELLED";

export interface Flight {
  id: string;
  flightNumber: string; // e.g. KQ412, KQ507, WSC201
  originAirportId: string;
  originAirport: Airport;
  destinationAirportId: string;
  destinationAirport: Airport;
  aircraftId: string;
  aircraft: Aircraft;
  scheduledArrival: string; // ISO string
  actualArrival?: string | null;
  scheduledDeparture: string; // ISO string
  estimatedDeparture: string; // ISO string
  actualDeparture?: string | null;
  status: FlightStatus;
  gate: string;
}

export type TaskType =
  | "DISEMBARKATION"
  | "BAGGAGE_UNLOAD"
  | "CABIN_CLEANING"
  | "REFUELING"
  | "CATERING"
  | "BAGGAGE_LOAD"
  | "BOARDING"
  | "PUSHBACK";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";

export interface TurnaroundTask {
  id: string;
  turnaroundId: string;
  type: TaskType;
  title: string;
  status: TaskStatus;
  sequenceOrder: number;
  assignedTeam: string;
  plannedStart: string; // ISO string
  plannedEnd: string; // ISO string
  actualStart?: string | null;
  actualEnd?: string | null;
  delayMinutes: number;
  isCritical: boolean; // Flag for critical path tasks (refueling, boarding, pushback)
  notes?: string | null;
}

export type RiskLevel = "GREEN" | "AMBER" | "RED";

export type TurnaroundStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Turnaround {
  id: string;
  flightId: string;
  flight: Flight;
  aircraftId: string;
  aircraft: Aircraft;
  gate: string;
  status: TurnaroundStatus;
  riskLevel: RiskLevel;
  riskReason?: string | null;
  scheduledDeparture: string;
  estimatedDeparture: string;
  delayMinutes: number;
  tasks: TurnaroundTask[];
  incidents?: Incident[];
  createdAt: string;
  updatedAt: string;
}

export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "RESOLVED";
export type IncidentType =
  | "GROUND_HANDLING"
  | "TECHNICAL"
  | "SECURITY"
  | "WEATHER"
  | "CREW"
  | "REFUELING"
  | "BAGGAGE";

export interface Incident {
  id: string;
  turnaroundId: string;
  incidentCode: string; // e.g. INC-0042
  flightNumber: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  status: IncidentStatus;
  reportedAt: string; // ISO string
  resolvedAt?: string | null;
  assignedTo: string; // Ground Operations, Maintenance, etc.
}

export interface OperationsSummary {
  activeFlightsCount: number;
  activeTurnaroundsCount: number;
  atRiskCount: number;
  delayedCount: number;
  completedTodayCount: number;
  averageTurnaroundMinutes: number;
  totalDelayMinutes: number;
  commonDelayReason: string;
}

/**
 * Result structure returned by the deterministic Operational Risk Engine
 */
export interface RiskEvaluationResult {
  riskLevel: RiskLevel;
  reasons: string[];
  estimatedDeparture: string;
  estimatedDelayMinutes: number;
  hasOperationalConflict: boolean;
  conflictDetails?: string;
}
