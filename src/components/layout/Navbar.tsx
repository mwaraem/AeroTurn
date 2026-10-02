"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plane,
  LayoutDashboard,
  RotateCw,
  AlertTriangle,
  BarChart3,
  Radio,
  Clock,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Turnarounds", href: "/turnarounds", icon: RotateCw },
  { label: "Flights", href: "/flights", icon: Plane },
  { label: "Incidents", href: "/incidents", icon: AlertTriangle },
  { label: "Operations Report", href: "/reports", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [stationTime, setStationTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const nboTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setStationTime(nboTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Operational Hub Badge */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 transition-all">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-base text-white flex items-center gap-1.5">
                  AeroTurn
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    OPS
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono tracking-wide">
                  HUB: NBO (JKIA)
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all",
                      isActive
                        ? "bg-slate-800 text-sky-400 border border-slate-700 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status: Clock, Live Telemetry, User Role */}
          <div className="flex items-center gap-4">
            {/* Live Station Clock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-slate-400">NBO:</span>
              <span className="font-semibold text-white tracking-wider">
                {stationTime || "14:12:00"}
              </span>
            </div>

            {/* Feed Status Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <Radio className="w-3 h-3 animate-ping" />
              <span className="hidden sm:inline">RAMP FEED ACTIVE</span>
            </div>

            {/* User Session Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200">Ops Dispatch</span>
                <span className="text-[10px] font-mono text-sky-400">OPS_MANAGER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
