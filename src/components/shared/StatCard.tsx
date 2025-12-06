"use client";

import React from "react";
import { Activity } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  color: "blue" | "emerald" | "amber" | "rose" | "slate" | "purple" | "green" | "orange" | "red";
  icon: React.ComponentType<{ className?: string }>;
  showTrendIcon?: boolean;
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-100",
    corner: "bg-blue-50",
    badge: "bg-blue-50 text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
    corner: "bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-100",
    corner: "bg-amber-50",
    badge: "bg-amber-50 text-amber-700",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-100",
    corner: "bg-rose-50",
    badge: "bg-rose-50 text-rose-700",
  },
  slate: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-100",
    corner: "bg-slate-50",
    badge: "bg-slate-50 text-slate-700",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-100",
    corner: "bg-purple-50",
    badge: "bg-purple-50 text-purple-700",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-100",
    corner: "bg-green-50",
    badge: "bg-green-50 text-green-700",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-100",
    corner: "bg-orange-50",
    badge: "bg-orange-50 text-orange-700",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-100",
    corner: "bg-red-50",
    badge: "bg-red-50 text-red-700",
  },
};

export default function StatCard({
  title,
  value,
  trend,
  color,
  icon: Icon,
  showTrendIcon = true,
}: StatCardProps) {
  const colors = colorClasses[color] || colorClasses.slate; // Fallback vers slate si couleur non trouvée

  return (
    <div className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${colors.corner} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-50`}
      ></div>
      <div className="flex justify-between items-start mb-4 relative">
        <div
          className={`p-3 rounded-lg ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={`flex items-center text-xs font-bold px-2 py-1 rounded ${colors.badge}`}
          >
            {showTrendIcon && <Activity className="w-3 h-3 mr-1" />}
            {trend}
          </span>
        )}
      </div>
      <div className="relative">
        <h3 className="text-slate-500 text-sm font-serif font-medium">
          {title}
        </h3>
        <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
