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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Operational Hub Badge */}
          <div className="flex items-center gap-6">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
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

            {/* Desktop Navigation links (visible on lg screens >= 1024px) */}
            <nav className="hidden lg:flex items-center space-x-1">
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

          {/* Right Status: Clock, Live Telemetry, User Role & Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Station Clock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-slate-400">NBO:</span>
              <span className="font-semibold text-white tracking-wider">
                {stationTime || "14:12:00"}
              </span>
            </div>

            {/* Feed Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <Radio className="w-3 h-3 animate-ping" />
              <span>RAMP FEED ACTIVE</span>
            </div>

            {/* User Session Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200">Ops Dispatch</span>
                <span className="text-[10px] font-mono text-sky-400">OPS_MANAGER</span>
              </div>
            </div>

            {/* Hamburger Toggle Button (visible on screens < 1024px) */}
            <button
              type="button"
              onClick={toggleMenu}
              className="lg:hidden relative z-50 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-sky-400" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Dropdown Drawer (visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          {/* Station Clock & Status in mobile drawer */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-slate-400">NBO Station:</span>
              <span className="font-semibold text-white tracking-wider">
                {stationTime || "14:12:00"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 font-mono">
              <Radio className="w-3 h-3 animate-ping" />
              <span>FEED LIVE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-slate-800 text-sky-400 border border-slate-700 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User profile info in mobile menu */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserCheck className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Ops Dispatcher</span>
                <span className="text-[10px] font-mono text-sky-400">ROLE: OPS_MANAGER</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              STATION CH 1
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
