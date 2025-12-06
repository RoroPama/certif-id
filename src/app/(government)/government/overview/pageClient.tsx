"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Download,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { useGovernmentDashboard } from "../hooks";

// Carte KPI "Haute Couture" : Minimaliste, Serif pour les chiffres
const SophisticatedMetric = ({
  label,
  value,
  trend,
  trendDirection = "neutral",
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "positive" | "negative" | "neutral";
}) => (
  <div className="group bg-white p-6 rounded-none border-r border-b border-slate-100 first:rounded-tl-2xl last:rounded-br-2xl hover:bg-slate-50/50 transition-colors relative">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
        {label}
      </p>
      {trend && (
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            trendDirection === "positive"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : trendDirection === "negative"
              ? "bg-rose-50 text-rose-700 border-rose-100"
              : "bg-slate-50 text-slate-600 border-slate-100"
          }`}
        >
          {trend}
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-1">
      <h3 className="text-4xl font-serif text-slate-900 tracking-tight">
        {value}
      </h3>
    </div>
  </div>
);

export default function OverviewPageClient() {
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string;
    endDate?: string;
    etablissementId?: string;
    documentTypeId?: string;
  }>({});

  const { stats, topEtablissements, revenueSummary, loading, error, refetch } =
    useGovernmentDashboard({
      filters: dateFilter,
    });

  // Calculer les métriques depuis les données backend
  const totalDiplomas = stats?.demandes.signee || 0;
  const activeUniversities = stats?.etablissements.actifs || 0;
  const pendingRequests = stats?.demandes.enAttente || 0;
  const totalDemandes = stats?.demandes.total || 0;
  const rejectedDemandes = stats?.demandes.rejetee || 0;
  const rejectionRate =
    totalDemandes > 0
      ? `${((rejectedDemandes / totalDemandes) * 100).toFixed(1)}%`
      : "0%";

  // Mapper l'évolution pour le graphique
  const chartData =
    stats?.evolution.map((item) => {
      const maxDemandes = Math.max(
        ...(stats.evolution.map((e) => e.demandesSignees) || [1])
      );
      return {
        year: item.periode,
        count: item.demandesSignees,
        heightPercent:
          maxDemandes > 0 ? (item.demandesSignees / maxDemandes) * 100 : 5,
      };
    }) || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Header Contextuel */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-medium text-slate-900">
            Tableau de Bord
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-lg leading-relaxed">
            Surveillance en temps réel des accréditations académiques et de la
            conformité nationale.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide hover:border-slate-300 hover:text-slate-900 transition-all rounded-sm shadow-sm">
            <Calendar className="w-3.5 h-3.5" /> Période : 2024
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-slate-800 transition-all rounded-sm shadow-lg shadow-slate-900/10">
            <Download className="w-3.5 h-3.5" /> Exporter Données
          </button>
        </div>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-slate-500 font-medium">
            Chargement des statistiques...
          </p>
        </div>
      )}

      {/* État d'erreur */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Erreur de chargement</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-medium rounded transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Grille de Métriques "Fusionnée" */}
      {!loading && stats && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <SophisticatedMetric
              label="Diplômes Certifiés"
              value={totalDiplomas.toLocaleString()}
              trend={
                stats.demandes.total > 0
                  ? `+${(
                      (stats.demandes.signee / stats.demandes.total) *
                      100
                    ).toFixed(1)}%`
                  : "0%"
              }
              trendDirection="positive"
            />
            <SophisticatedMetric
              label="Universités Actives"
              value={activeUniversities}
              trend={
                stats.etablissements.total > 0
                  ? `${(
                      (activeUniversities / stats.etablissements.total) *
                      100
                    ).toFixed(0)}%`
                  : "0%"
              }
            />
            <SophisticatedMetric
              label="Dossiers en attente"
              value={pendingRequests}
              trend={
                stats.demandes.total > 0
                  ? `${((pendingRequests / stats.demandes.total) * 100).toFixed(
                      1
                    )}%`
                  : "0%"
              }
              trendDirection="neutral"
            />
            <SophisticatedMetric
              label="Taux de Rejet"
              value={rejectionRate}
              trend={
                stats.demandes.total > 0
                  ? `${(
                      (rejectedDemandes / stats.demandes.total) *
                      100
                    ).toFixed(1)}%`
                  : "0%"
              }
              trendDirection="negative"
            />
          </div>
        </div>
      )}

      {/* Section Principale : Graphiques & Listes */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique "Analytique" */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-serif font-medium text-slate-900">
                  Volume d&apos;Émission
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-bold">
                  Évolution des demandes signées
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-900 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Visualisation épurée */}
            <div className="h-72 flex items-end gap-6 relative">
              {/* Grille de fond très légère */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-slate-50"></div>
                ))}
              </div>

              {chartData.length > 0 ? (
                chartData.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end gap-3 group h-full relative z-10"
                  >
                    <div
                      className="w-full bg-slate-900 opacity-90 hover:opacity-100 transition-all duration-500 relative"
                      style={{ height: `${Math.max(item.heightPercent, 2)}%` }}
                    >
                      {/* Valeur au survol */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold py-1 px-2 border border-slate-100 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {item.count}
                      </div>
                    </div>
                    <div className="h-px w-full bg-slate-200"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                      {item.year}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm italic font-serif">
                  Données indisponibles pour la période sélectionnée
                </div>
              )}
            </div>
          </div>

          {/* Panneau Latéral "Top Établissements" */}
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Top Établissements
              </h3>
              <Link
                href={GOVERNMENT_ROUTES.UNIVERSITIES}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                Détails <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {topEtablissements.length > 0 ? (
                <div className="space-y-1">
                  {topEtablissements.map((etab, i) => {
                    const maxDemandes = Math.max(
                      ...topEtablissements.map((e) => e.demandesSignees),
                      1
                    );
                    const percent = (etab.demandesSignees / maxDemandes) * 100;
                    return (
                      <Link
                        key={etab.etablissement.id}
                        href={GOVERNMENT_ROUTES.UNIVERSITY_DETAIL(
                          etab.etablissement.id
                        )}
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="flex-shrink-0 w-6 h-6 rounded bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-sm text-slate-600 font-medium truncate group-hover:text-slate-900 transition-colors">
                            {etab.etablissement.nom}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 tabular-nums">
                            {etab.demandesSignees}
                          </span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-800"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-8">
                  Aucune donnée
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/30 rounded-b-xl">
              <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors">
                Voir le rapport complet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
