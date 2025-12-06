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
  ArrowUpRight,
  FilePlus,
  Search,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { useOverview } from "../hooks/useOverview";
import type { ApprovedDiploma, SubmittedRequest, Filiere } from "../types";

// Composant Métrique "Executive"
const ExecutiveMetric = ({
  label,
  value,
  trend,
  icon: Icon,
  trendType = "neutral",
}: {
  label: string;
  value: number | string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  trendType?: "positive" | "negative" | "neutral";
}) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-md text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
          trendType === "positive"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : trendType === "negative"
            ? "bg-amber-50 text-amber-700 border-amber-100"
            : "bg-slate-50 text-slate-600 border-slate-100"
        }`}
      >
        {trend}
      </span>
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-3xl font-serif text-slate-900 tracking-tight">
        {value}
      </h3>
    </div>
  </div>
);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Contextuel */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-medium text-slate-900">
            Performance Académique
          </h2>
          <p className="text-slate-500 mt-1 text-sm max-w-lg leading-relaxed">
            Suivi des émissions de titres et gestion des promotions en cours.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-md">
            <Calendar className="w-3.5 h-3.5" /> Année 2023-2024
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExecutiveMetric
          label="Diplômes Certifiés"
          value={stats.totalCertified}
          trend="+12%"
          trendType="positive"
          icon={Award}
        />
        <ExecutiveMetric
          label="Demandes en Cours"
          value={stats.pendingRequests}
          trend="Action requise"
          trendType="negative"
          icon={Clock}
        />
        <ExecutiveMetric
          label="Filières Actives"
          value={stats.activeFilieres}
          trend="Stable"
          icon={Scroll}
        />
      </div>

      {/* Contenu Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activité Récente (Tableau) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileClock className="w-4 h-4 text-slate-400" />
              Activité Récente
            </h3>
            <Link
              href="/dashboard/requests"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              Tout voir <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {recentActivity.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-serif font-bold text-slate-600 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm transition-all">
                    REQ
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 font-serif group-hover:text-blue-900 transition-colors">
                      {req.reference}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {req.submissionDate} •{" "}
                      <span className="text-slate-400">
                        {req.totalCount} documents
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {req.rejectedCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-100">
                      <AlertTriangle className="w-3 h-3" /> Rejets (
                      {req.rejectedCount})
                    </span>
                  ) : req.pendingCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                      <Clock className="w-3 h-3" /> En cours
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> Validé
                    </span>
                  )}
                  <Link
                    href={`/dashboard/requests/${req.id}`}
                    className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Rapides "Carte de Commande" */}
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
          {/* Effet subtil */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>

          <h3 className="font-serif font-bold text-lg mb-1 relative z-10">
            Espace Rapide
          </h3>
          <p className="text-slate-400 text-xs mb-8 relative z-10 leading-relaxed">
            Raccourcis vers les opérations courantes de gestion des titres.
          </p>

          <div className="space-y-3 relative z-10">
            <Link
              href="/dashboard/new-request"
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex items-center gap-3 transition-all group"
            >
              <div className="bg-blue-500/20 p-2 rounded text-blue-300 group-hover:text-blue-200">
                <FilePlus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Nouvelle Demande</p>
                <p className="text-[10px] text-slate-400 group-hover:text-slate-300">
                  Soumettre un bordereau
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/registry"
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex items-center gap-3 transition-all group"
            >
              <div className="bg-emerald-500/20 p-2 rounded text-emerald-300 group-hover:text-emerald-200">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Rechercher</p>
                <p className="text-[10px] text-slate-400 group-hover:text-slate-300">
                  Vérifier un titre
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
