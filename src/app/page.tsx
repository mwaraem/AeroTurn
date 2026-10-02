import React from "react";
import Link from "next/link";
import {
  Plane,
  RotateCw,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
} from "lucide-react";
import { MOCK_TURNAROUNDS, MOCK_OPERATIONS_SUMMARY } from "@/lib/mock-data";
import { TurnaroundRiskBadge } from "@/components/turnaround/TurnaroundRiskBadge";
import { formatTime } from "@/lib/utils";

export default function OperationsDashboard() {
  const summary = MOCK_OPERATIONS_SUMMARY;
  const turnarounds = MOCK_TURNAROUNDS;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner / Station Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Operations Control Dashboard
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time station turnarounds, ramp sequencing, and operational conflict tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Operational Day: Today (UTC+3)</span>
          </div>
          <Link
            href="/turnarounds"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-all shadow-sm shadow-sky-950"
          >
            Manage Turnarounds
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Flights */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Flights
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {summary.activeFlightsCount}
            </span>
            <span className="text-xs text-slate-400">monitored today</span>
          </div>
        </div>

        {/* Turnarounds In Progress */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Turnarounds
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <RotateCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {summary.activeTurnaroundsCount}
            </span>
            <span className="text-xs text-slate-400">on ramp</span>
          </div>
        </div>

        {/* Turnarounds At Risk */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              At Risk
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400 font-mono">
              {summary.atRiskCount}
            </span>
            <span className="text-xs text-amber-500/80">critical threshold</span>
          </div>
        </div>

        {/* Delayed */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">
              Delayed Turnarounds
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400 font-mono">
              {summary.delayedCount}
            </span>
            <span className="text-xs text-rose-500/80">exceeding schedule</span>
          </div>
        </div>
      </div>

      {/* Operational Risk Engine Alert Spotlight */}
      <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Operational Risk Engine Warning
              </span>
              <span className="text-xs text-slate-400 font-mono">• KQ507 (NBO → EBB)</span>
            </div>
            <p className="text-sm font-medium text-slate-200 mt-0.5">
              Refueling bowser delayed by 11 minutes. Scheduled departure in &lt;30m window.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic rule triggered: Estimated departure pushed to 14:58 (+13m). Ground crew alerted.
            </p>
          </div>
        </div>
        <Link
          href={`/turnarounds/turn-kq507`}
          className="px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold whitespace-nowrap transition-all self-start md:self-auto"
        >
          Inspect Turnaround Timeline →
        </Link>
      </div>

      {/* Active Turnarounds Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-semibold text-white">Active Ramp Turnarounds</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Station: NBO Apron Control
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Flight</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Aircraft</th>
                <th className="py-3 px-4">Gate</th>
                <th className="py-3 px-4">Sched Dep</th>
                <th className="py-3 px-4">Est Dep</th>
                <th className="py-3 px-4">Delay</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {turnarounds.map((turn) => {
                const isDelayed = turn.delayMinutes > 0;
                return (
                  <tr
                    key={turn.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sky-400" />
                      {turn.flight.flightNumber}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-300">
                      {turn.flight.originAirport.code} → {turn.flight.destinationAirport.code}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {turn.aircraft.model}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-300">{turn.gate}</td>
                    <td className="py-4 px-4 font-mono text-slate-400">
                      {formatTime(turn.scheduledDeparture)}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-200">
                      {formatTime(turn.estimatedDeparture)}
                    </td>
                    <td className="py-4 px-4 font-mono">
                      {isDelayed ? (
                        <span className="text-rose-400 font-semibold">
                          +{turn.delayMinutes}m
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">0m</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <TurnaroundRiskBadge level={turn.riskLevel} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/turnarounds/${turn.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 group-hover:translate-x-0.5 transition-transform"
                      >
                        Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
