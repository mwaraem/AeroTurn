"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Turnaround,
  TurnaroundTask,
} from "@/types";
import {
  Plane,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  Layers,
  MapPin,
} from "lucide-react";
import { TurnaroundTimeline } from "@/components/turnaround/TurnaroundTimeline";
import { TurnaroundRiskBadge } from "@/components/turnaround/TurnaroundRiskBadge";
import { calculateTurnaroundRisk } from "@/features/risk-engine/calculateRisk";
import { formatTime, formatOperationalDate } from "@/lib/utils";

interface TurnaroundDetailClientProps {
  initialTurnaround: Turnaround;
}

export function TurnaroundDetailClient({
  initialTurnaround,
}: TurnaroundDetailClientProps) {
  const [turnaround, setTurnaround] = useState<Turnaround>(initialTurnaround);

  // Recalculate operational risk dynamically when tasks are updated
  const handleUpdateTask = (taskId: string, updates: Partial<TurnaroundTask>) => {
    setTurnaround((prev) => {
      const updatedTasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );

      // Evaluate new risk state deterministically
      const evaluation = calculateTurnaroundRisk({
        tasks: updatedTasks,
        scheduledDeparture: prev.scheduledDeparture,
      });

      return {
        ...prev,
        tasks: updatedTasks,
        riskLevel: evaluation.riskLevel,
        riskReason: evaluation.reasons[0] || null,
        estimatedDeparture: evaluation.estimatedDeparture,
        delayMinutes: evaluation.estimatedDelayMinutes,
      };
    });
  };

  const riskEvaluation = calculateTurnaroundRisk({
    tasks: turnaround.tasks,
    scheduledDeparture: turnaround.scheduledDeparture,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button & Top Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Operations Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <TurnaroundRiskBadge level={turnaround.riskLevel} />
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Gate {turnaround.gate}
          </span>
        </div>
      </div>

      {/* Flight & Turnaround Hero Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Flight identifiers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-bold tracking-tight text-white flex items-center gap-2">
                <Plane className="w-7 h-7 text-sky-400" />
                {turnaround.flight.flightNumber}
              </span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Turnaround Active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>
                  {turnaround.flight.originAirport.city} ({turnaround.flight.originAirport.code})
                  {" → "}
                  {turnaround.flight.destinationAirport.city} ({turnaround.flight.destinationAirport.code})
                </span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="text-xs font-mono text-slate-400">
                Aircraft: <span className="text-white font-semibold">{turnaround.aircraft.model}</span> ({turnaround.aircraft.registration})
              </div>
              <span className="text-slate-600">•</span>
              <div className="text-xs font-mono text-slate-400">
                Capacity: <span className="text-white">{turnaround.aircraft.capacity} seats</span>
              </div>
            </div>
          </div>

          {/* Departure & Delay Comparison */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono">
            <div className="text-left pr-4 border-r border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Sched Departure
              </span>
              <span className="text-xl font-bold text-white">
                {formatTime(turnaround.scheduledDeparture)}
              </span>
            </div>

            <div className="text-left pr-4 border-r border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Est Departure
              </span>
              <span
                className={
                  turnaround.delayMinutes > 0
                    ? "text-xl font-bold text-rose-400"
                    : "text-xl font-bold text-emerald-400"
                }
              >
                {formatTime(turnaround.estimatedDeparture)}
              </span>
            </div>

            <div className="text-left">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Delay
              </span>
              <span
                className={
                  turnaround.delayMinutes > 0
                    ? "text-xl font-bold text-rose-400"
                    : "text-xl font-bold text-emerald-400"
                }
              >
                {turnaround.delayMinutes > 0 ? `+${turnaround.delayMinutes} min` : "ON TIME"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Conflict / Risk Engine Explanations */}
      {riskEvaluation.hasOperationalConflict ? (
        <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-300">
              Operational Conflict Detected
            </h4>
            <p className="text-sm font-medium text-rose-100 mt-1">
              {riskEvaluation.conflictDetails}
            </p>
            <p className="text-xs text-rose-300/80 mt-1">
              Safety Protocol Violation: Ground operations safety mandates critical tasks must complete before boarding starts.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300">
            <div className="font-semibold text-white mb-0.5 flex items-center gap-2">
              <span>Operational Risk Assessment</span>
              <span className="font-mono text-[10px] text-slate-400">
                Rule-Engine Evaluated
              </span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 mt-1">
              {riskEvaluation.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* The 8-Stage Turnaround Milestone Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-semibold text-white">
              Turnaround Milestone Pipeline (8 Stages)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Live Ramp Sequencing
          </span>
        </div>

        <TurnaroundTimeline
          turnaround={turnaround}
          onUpdateTask={handleUpdateTask}
        />
      </div>

      {/* Incidents Section if logged */}
      {turnaround.incidents && turnaround.incidents.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Associated Ramp Incidents ({turnaround.incidents.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {turnaround.incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-sky-400">{inc.incidentCode}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                    {inc.severity}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{inc.description}</p>
                <div className="flex items-center justify-between text-slate-500 font-mono pt-2 border-t border-slate-800/60">
                  <span>Assigned: {inc.assignedTo}</span>
                  <span>{formatOperationalDate(inc.reportedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
