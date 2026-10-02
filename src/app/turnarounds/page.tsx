"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCw,
  Search,
  ArrowRight,
  Plane,
} from "lucide-react";
import { MOCK_TURNAROUNDS } from "@/lib/mock-data";
import { TurnaroundRiskBadge } from "@/components/turnaround/TurnaroundRiskBadge";
import { formatTime, cn } from "@/lib/utils";

export default function TurnaroundsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredTurnarounds = MOCK_TURNAROUNDS.filter((t) => {
    const matchesSearch =
      t.flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.aircraft.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.flight.originAirport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.flight.destinationAirport.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && t.riskLevel === statusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <RotateCw className="w-6 h-6 text-sky-400" />
              Active Turnarounds
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
              {filteredTurnarounds.length} SECTORS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time turnaround management, ground handling milestone progression, and risk dispatch.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by flight number, aircraft, or gate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
              statusFilter === "ALL"
                ? "bg-sky-500/20 border-sky-400 text-sky-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            )}
          >
            All Turnarounds
          </button>
          <button
            onClick={() => setStatusFilter("GREEN")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
              statusFilter === "GREEN"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400"
            )}
          >
            On Track (Green)
          </button>
          <button
            onClick={() => setStatusFilter("AMBER")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
              statusFilter === "AMBER"
                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400"
            )}
          >
            At Risk (Amber)
          </button>
          <button
            onClick={() => setStatusFilter("RED")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
              statusFilter === "RED"
                ? "bg-rose-500/20 border-rose-400 text-rose-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400"
            )}
          >
            Critical (Red)
          </button>
        </div>
      </div>

      {/* Turnarounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTurnarounds.map((turn) => {
          const completedCount = turn.tasks.filter((t) => t.status === "COMPLETED").length;
          const progressPercent = Math.round((completedCount / turn.tasks.length) * 100);

          return (
            <div
              key={turn.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/40 hover:border-slate-700 transition-all p-5 flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                      <Plane className="w-5 h-5 -rotate-45" />
                    </div>
                    <div>
                      <h3 className="font-mono text-lg font-bold text-white">
                        {turn.flight.flightNumber}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {turn.flight.originAirport.code} → {turn.flight.destinationAirport.code}
                      </p>
                    </div>
                  </div>
                  <TurnaroundRiskBadge level={turn.riskLevel} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 font-mono">Aircraft:</span>
                    <span className="font-medium">{turn.aircraft.model}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 font-mono">Gate / Stand:</span>
                    <span className="font-mono text-white">{turn.gate}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 font-mono">Sched / Est Dep:</span>
                    <span className="font-mono">
                      {formatTime(turn.scheduledDeparture)} →{" "}
                      <span
                        className={
                          turn.delayMinutes > 0
                            ? "text-rose-400 font-bold"
                            : "text-emerald-400 font-bold"
                        }
                      >
                        {formatTime(turn.estimatedDeparture)}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 font-mono">Delay Status:</span>
                    <span
                      className={
                        turn.delayMinutes > 0
                          ? "text-rose-400 font-bold font-mono"
                          : "text-emerald-400 font-bold font-mono"
                      }
                    >
                      {turn.delayMinutes > 0 ? `+${turn.delayMinutes} min` : "ON SCHEDULE"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-2">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-bold">
                      {completedCount}/{turn.tasks.length} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        turn.riskLevel === "RED"
                          ? "bg-rose-500"
                          : turn.riskLevel === "AMBER"
                          ? "bg-amber-500"
                          : "bg-sky-500"
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/turnarounds/${turn.id}`}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-sky-600 hover:text-white text-xs font-semibold text-sky-400 border border-slate-700/60 flex items-center justify-center gap-1.5 transition-all"
              >
                Inspect Timeline & Dispatch
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
