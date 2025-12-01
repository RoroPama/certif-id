"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  Clock,
  Scroll,
  FileClock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  FilePlus,
  Search,
} from "lucide-react";
import { useOverview } from "../hooks/useOverview";
import { INSTITUTION_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { ApprovedDiploma, SubmittedRequest, Filiere } from "../types";

interface OverviewPageClientProps {
  initialRegistryData: ApprovedDiploma[];
  initialHistoryData: SubmittedRequest[];
  initialFilieres: Filiere[];
}

export default function OverviewPageClient({
  initialRegistryData,
  initialHistoryData,
  initialFilieres,
}: OverviewPageClientProps) {
  const { stats, recentActivity } = useOverview({
    registryData: initialRegistryData,
    historyData: initialHistoryData,
    filieres: initialFilieres,
  });

  const { stats: statsLabels, activity, quickActions } = MESSAGES.institution;
  const { status } = MESSAGES;

  return (
    <>
      {/* Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: statsLabels.certifiedDiplomas,
            value: stats.totalCertified,
            trend: "+12%",
            color: "blue",
            icon: Award,
          },
          {
            title: statsLabels.pendingRequests,
            value: stats.pendingRequests,
            trend: statsLabels.studentsWaiting,
            color: "amber",
            icon: Clock,
          },
          {
            title: statsLabels.activeFilieres,
            value: stats.activeFilieres,
            trend: "Année 2023-24",
            color: "emerald",
            icon: Scroll,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="group bg-white p-6 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-50`}
            ></div>
            <div className="flex justify-between items-start mb-4 relative">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-700 ring-1 ring-${stat.color}-100`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="relative">
              <h3 className="text-slate-500 text-sm font-serif font-medium">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-${stat.color}-50 text-${stat.color}-700 border border-${stat.color}-100`}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section d'activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-slate-800 text-lg">
              {activity.title}
            </h3>
            <Link
              href={INSTITUTION_ROUTES.REQUESTS}
              className="text-sm text-blue-900 font-medium hover:underline flex items-center gap-1"
            >
              {activity.viewAll} <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((req) => (
              <Link
                key={req.id}
                href={INSTITUTION_ROUTES.REQUEST_DETAIL(req.id)}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-slate-200 shadow-sm text-slate-400 group-hover:text-blue-900 transition-colors">
                    <FileClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 font-serif">
                      {activity.request} {req.reference}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {req.submissionDate} • {req.totalCount} {activity.diplomas}
                    </p>
                  </div>
                </div>
                {req.rejectedCount > 0 ? (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3" /> {MESSAGES.common.rejections}
                  </span>
                ) : req.pendingCount > 0 ? (
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" /> {status.inProgress}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> {status.approved}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <h3 className="font-serif font-bold text-xl mb-1 relative z-10">
            {quickActions.title}
          </h3>
          <p className="text-blue-200/80 text-sm mb-8 relative z-10">
            {quickActions.description}
          </p>
          <div className="space-y-3 relative z-10">
            <Link
              href={INSTITUTION_ROUTES.NEW_REQUEST}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg p-3 flex items-center gap-3 transition-all group"
            >
              <div className="bg-amber-500/20 p-1.5 rounded text-amber-400 group-hover:text-amber-300">
                <FilePlus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{quickActions.newRequest}</span>
            </Link>
            <Link
              href={INSTITUTION_ROUTES.REGISTRY}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg p-3 flex items-center gap-3 transition-all group"
            >
              <div className="bg-amber-500/20 p-1.5 rounded text-amber-400 group-hover:text-amber-300">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{quickActions.searchTitle}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
