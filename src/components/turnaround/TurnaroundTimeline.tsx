"use client";

import React, { useState } from "react";
import {
  TurnaroundTask,
  TaskStatus,
  Turnaround,
} from "@/types";
import {
  Users,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { formatTime, cn } from "@/lib/utils";

interface TurnaroundTimelineProps {
  turnaround: Turnaround;
  onUpdateTask?: (taskId: string, updates: Partial<TurnaroundTask>) => void;
}

export function TurnaroundTimeline({
  turnaround,
  onUpdateTask,
}: TurnaroundTimelineProps) {
  const [selectedTask, setSelectedTask] = useState<TurnaroundTask | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editDelay, setEditDelay] = useState(0);

  const completedCount = turnaround.tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / turnaround.tasks.length) * 100);

  const openTaskModal = (task: TurnaroundTask) => {
    setSelectedTask(task);
    setEditNotes(task.notes || "");
    setEditDelay(task.delayMinutes || 0);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!selectedTask || !onUpdateTask) return;
    const nowIso = new Date().toISOString();
    const updates: Partial<TurnaroundTask> = {
      status: newStatus,
      delayMinutes: editDelay,
      notes: editNotes,
    };

    if (newStatus === "IN_PROGRESS" && !selectedTask.actualStart) {
      updates.actualStart = nowIso;
    } else if (newStatus === "COMPLETED") {
      if (!selectedTask.actualStart) updates.actualStart = nowIso;
      updates.actualEnd = nowIso;
    }

    onUpdateTask(selectedTask.id, updates);
    setSelectedTask(null);
  };

  const handleSaveDetails = () => {
    if (!selectedTask || !onUpdateTask) return;
    onUpdateTask(selectedTask.id, {
      delayMinutes: Number(editDelay),
      notes: editNotes,
    });
    setSelectedTask(null);
  };


  const getStatusBadge = (status: TaskStatus, delayMinutes: number) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            COMPLETED
          </span>
        );
      case "DELAYED":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            DELAYED (+{delayMinutes}m)
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            IN PROGRESS
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Turnaround Progress Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Turnaround Progress</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {completedCount} / {turnaround.tasks.length} Completed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click on any milestone to update ramp progress, log delays, or record operations dispatch notes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-48 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Completion</span>
            <span className="text-white font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progressPercent === 100
                  ? "bg-emerald-500"
                  : turnaround.riskLevel === "RED"
                  ? "bg-rose-500"
                  : turnaround.riskLevel === "AMBER"
                  ? "bg-amber-500"
                  : "bg-sky-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sequential Milestone Pipeline */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {turnaround.tasks.map((task, index) => {
          const isSelected = selectedTask?.id === task.id;

          return (
            <div
              key={task.id}
              onClick={() => openTaskModal(task)}
              className={cn(
                "relative group cursor-pointer p-4 rounded-xl border transition-all duration-200",
                isSelected
                  ? "bg-slate-800/90 border-sky-500 shadow-md shadow-sky-950/50"
                  : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
              )}
            >
              {/* Connector node circle */}
              <div
                className={cn(
                  "absolute -left-6 sm:-left-8 top-5 -translate-x-1/2 w-6 h-6 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-all",
                  task.status === "COMPLETED"
                    ? "border-emerald-500 text-emerald-400"
                    : task.status === "DELAYED"
                    ? "border-rose-500 text-rose-400 animate-pulse"
                    : task.status === "IN_PROGRESS"
                    ? "border-sky-500 text-sky-400 shadow-sm shadow-sky-500/50"
                    : "border-slate-700 text-slate-500"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    task.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : task.status === "DELAYED"
                      ? "bg-rose-500"
                      : task.status === "IN_PROGRESS"
                      ? "bg-sky-400 animate-ping"
                      : "bg-transparent"
                  )}
                />
              </div>

              {/* Task Header & Timing */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500 w-5">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                        {task.title}
                      </h4>
                      {task.isCritical && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                          CRITICAL PATH
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {task.assignedTeam}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  {/* Planned vs Actual Times */}
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-400">
                      Planned: {formatTime(task.plannedStart)} – {formatTime(task.plannedEnd)}
                    </div>
                    {task.actualStart && (
                      <div className="text-slate-300 font-semibold">
                        Actual: {formatTime(task.actualStart)}
                        {task.actualEnd ? ` – ${formatTime(task.actualEnd)}` : " (ongoing)"}
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>{getStatusBadge(task.status, task.delayMinutes)}</div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Task Notes / Operational log */}
              {task.notes && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg font-mono">
                  <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{task.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Interaction & Dispatch Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{selectedTask.title}</h3>
                  {selectedTask.isCritical && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                      CRITICAL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Assigned: {selectedTask.assignedTeam}
                </p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Action Buttons */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Update Operational Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("PENDING")}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                    selectedTask.status === "PENDING"
                      ? "bg-slate-700 border-slate-500 text-white"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                    selectedTask.status === "IN_PROGRESS"
                      ? "bg-sky-500/20 border-sky-400 text-sky-300"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-sky-950 hover:border-sky-600"
                  )}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("COMPLETED")}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                    selectedTask.status === "COMPLETED"
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-emerald-950 hover:border-emerald-600"
                  )}
                >
                  Complete
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("DELAYED")}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                    selectedTask.status === "DELAYED"
                      ? "bg-rose-500/20 border-rose-400 text-rose-300"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-rose-950 hover:border-rose-600"
                  )}
                >
                  Delayed
                </button>
              </div>
            </div>

            {/* Delay minutes modifier */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Delay Minutes (Ramp Latency)
              </label>
              <input
                type="number"
                min="0"
                max="180"
                value={editDelay}
                onChange={(e) => setEditDelay(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Adjusting delay recalculates downstream task windows & overall turnaround risk.
              </span>
            </div>

            {/* Operational Notes */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Operational Dispatch Notes
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Fuel bowser late arrival, ground power unit swap, extra bags..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDetails}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-all shadow-md shadow-sky-950"
              >
                Save Dispatch Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
