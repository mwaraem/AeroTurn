# AeroTurn — Aircraft Turnaround & Ground Operations Platform

> A real-time aircraft turnaround and ground operations management platform built with Next.js, TypeScript, and PostgreSQL.

---

## ✈️ Problem

Turnaround operations are the heartbeat of airline reliability. When an aircraft touches down, ground crews have a rigid, tightly sequenced window to perform passenger disembarkation, baggage offloading, cabin cleaning, fueling, catering replenishment, baggage loading, boarding, and pushback.

If a single operational milestone is delayed (e.g. late fuel bowser or belt loader fault), downstream tasks cascade, leading to expensive departure slot delays, crew timeout penalties, and passenger disruption. Ground handlers require real-time visibility and deterministic conflict detection—not delayed post-mortems.

## 🚀 Solution

**AeroTurn** provides an airport operations control dashboard that monitors active ramp turnarounds in real time. It sequences ground handling milestones, evaluates operational delays against scheduled departure buffers, flags safety and sequencing conflicts, and calculates dynamic Estimated Departure Times (EDT).

---

## 🔑 Key Features

- **Operations Control Dashboard**: Real-time overview of active ramp flights, turnaround statuses, delayed sectors, and apron KPIs.
- **Milestone Timeline Tracker**: Step-by-step 8-stage turnaround pipeline (Disembarkation → Baggage Unload → Cleaning → Refueling → Catering → Baggage Load → Boarding → Pushback) tracking planned vs. actual progress.
- **Deterministic Operational Risk Engine**: Evaluates task latencies and imminent departure windows without opaque heuristics to classify turnarounds into `GREEN` (On Track), `AMBER` (At Risk), or `RED` (Critical / Delayed).
- **Operational Conflict Flagging**: Detects illegal or risky task states (e.g., Passenger Boarding commenced while Cabin Cleaning or Baggage Unloading is still incomplete).
- **Incident Management**: Ramp anomaly logging with severity ratings, department assignments, and resolution audits.
- **Operations Reporting**: Station performance metrics, average turnaround durations, and root-cause delay attribution.

---

## 🏗️ Architecture

```
AeroTurn Architecture
├── Next.js (App Router)
│   ├── app/                    # Operational routes & API handlers
│   │   ├── (dashboard)/        # Operations views (Dashboard, Flights, Turnarounds, Incidents, Reports)
│   │   └── api/                # REST endpoints for ground tasks & risk assessment
│   ├── components/             # Reusable UI components & layouts
│   │   ├── layout/             # Station clock, Top navigation, Sidebar
│   │   └── turnaround/         # Risk badges, milestone timeline, conflict cards
│   ├── features/               # Core domain logic
│   │   └── risk-engine/        # Deterministic risk engine & conflict evaluator
│   ├── lib/                    # Database client, utilities, mock data
│   └── types/                  # Strict TypeScript domain models
└── Database
    └── PostgreSQL              # Relational schema (Airport, Aircraft, Flight, Turnaround, Task, Incident)
```

---

## 🧩 Domain Model

- **Airport**: Station identifiers (IATA code, timezone, hub status).
- **Aircraft**: Tail registrations, aircraft type, passenger capacity.
- **Flight**: Scheduled times, actual arrival/departure, route origin/destination.
- **Turnaround**: Central operational entity tying flight, aircraft, gate, and timeline.
- **TurnaroundTask**: 8 core ground activities with planned/actual timestamps, sequence order, delay minutes, and criticality flags.
- **Incident**: Ramp irregularities categorized by severity, department, and resolution state.

---

## ⚙️ Operational Rules Engine

The risk engine (`calculateTurnaroundRisk`) enforces deterministic ground-handling rules:

1. **Prerequisite Conflict Rule**:
   $$\text{IF } \text{status}(\text{Boarding}) \in \{\text{IN\_PROGRESS}, \text{COMPLETED}\} \land \exists t \in \{\text{Cleaning}, \text{BaggageUnload}\} : \text{status}(t) \neq \text{COMPLETED}$$
   $$\implies \textbf{RED RISK} \text{ (Operational Conflict Flagged)}$$

2. **Refueling Departure Window Rule**:
   $$\text{IF } \text{delayMinutes}(\text{Refueling}) > 0 \land \text{minutesUntilDeparture} < 30 \implies \textbf{RED RISK}$$

3. **Imminent Departure Critical Task Rule**:
   $$\text{IF } \text{minutesUntilDeparture} < 15 \land \exists t \in \text{CriticalTasks} : \text{status}(t) \neq \text{COMPLETED} \implies \textbf{RED RISK}$$

4. **Dynamic Estimated Departure Time (EDT)**:
   $$\text{EDT} = \max(\text{ScheduledDeparture}, \max_{t}(\text{PlannedEnd}_t + \text{Delay}_t))$$

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Time Operations**: Date-fns
- **Database / ORM**: PostgreSQL, Prisma ORM
- **Deployment**: Vercel & Neon / Supabase PostgreSQL

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 24)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/aeroturn.git
   cd aeroturn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
