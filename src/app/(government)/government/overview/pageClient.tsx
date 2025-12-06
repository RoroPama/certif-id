"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Building2,
  Users,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { StatCard, SearchableSelect } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useGovernmentDashboard } from "../hooks";
import {
  MonthlyEvolutionChart,
  DocumentTypeChart,
  StatusChart,
} from "@/app/(institution)/institution/components/charts";
import LoadingState from "@/app/(institution)/institution/components/LoadingState";
import ErrorState from "@/app/(institution)/institution/components/ErrorState";

export default function OverviewPageClient() {
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string;
    endDate?: string;
    etablissementId?: string;
    documentTypeId?: string;
  }>({});

  const {
    stats,
    topEtablissements,
    revenueSummary,
    loading,
    error,
    refetch,
  } = useGovernmentDashboard({
    filters: dateFilter,
  });

  const { government } = MESSAGES;

  // Fonction pour formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fonction pour formater la date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filtres de date */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-slate-500" />
          <div className="flex items-center gap-4 flex-1">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">
                Date de début
              </label>
              <input
                type="date"
                value={dateFilter.startDate || ""}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">
                Date de fin
              </label>
              <input
                type="date"
                value={dateFilter.endDate || ""}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, endDate: e.target.value })
                }
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {(dateFilter.startDate || dateFilter.endDate) && (
              <button
                onClick={() => setDateFilter({})}
                className="mt-6 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total demandes"
          value={stats?.demandes?.total?.toLocaleString() || "0"}
          trend={`${stats?.demandes?.signee || 0} signées`}
          color="blue"
          icon={FileText}
          showTrendIcon={false}
        />
        <StatCard
          title="Demandes en attente"
          value={stats?.demandes?.enAttente?.toLocaleString() || "0"}
          trend={MESSAGES.status.inProgress}
          color="amber"
          icon={Clock}
        />
        <StatCard
          title="Demandes approuvées"
          value={stats?.demandes?.approuvees?.toLocaleString() || "0"}
          trend={`${stats?.demandes?.signee || 0} signées`}
          color="emerald"
          icon={CheckCircle2}
          showTrendIcon={false}
        />
        <StatCard
          title="Chiffre d'affaires"
          value={formatAmount(stats?.chiffreAffaires?.total || 0)}
          trend={stats?.chiffreAffaires?.periode || "Toutes périodes"}
          color="purple"
          icon={DollarSign}
          showTrendIcon={false}
        />
        <StatCard
          title="Établissements"
          value={stats?.etablissements?.total?.toLocaleString() || "0"}
          trend={`${stats?.etablissements?.actifs || 0} actifs`}
          color="emerald"
          icon={Building2}
          showTrendIcon={false}
        />
        <StatCard
          title="Demandes rejetées"
          value={stats?.demandes?.rejetee?.toLocaleString() || "0"}
          trend={MESSAGES.common.rejections}
          color="rose"
          icon={XCircle}
        />
        <StatCard
          title="Documents signés"
          value={stats?.demandes?.signee?.toLocaleString() || "0"}
          trend="Total"
          color="green"
          icon={Award}
          showTrendIcon={false}
        />
        <StatCard
          title="Montant total dû"
          value={formatAmount(stats?.etablissements?.montantTotalDu || 0)}
          trend="Par établissements"
          color="orange"
          icon={TrendingUp}
          showTrendIcon={false}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Évolution mensuelle */}
          {stats && stats.evolution.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Évolution mensuelle
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Demandes signées et chiffre d'affaires sur 12 mois
                  </p>
                </div>
                <Link
                  href={GOVERNMENT_ROUTES.REGISTRY}
                  className="text-sm text-emerald-700 font-medium hover:underline flex items-center gap-1"
                >
                  {MESSAGES.common.viewAll || "Tout voir"}{" "}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="h-64">
                <MonthlyEvolutionChart
                  data={stats.evolution.map((item) => ({
                    mois: item.periode,
                    count: item.demandesSignees,
                  }))}
                />
              </div>
            </div>
          )}

          {/* Répartition par statut */}
          {stats && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
                Répartition des demandes par statut
              </h3>
              <StatusChart
                data={[
                  { statut: "EN_ATTENTE", count: stats.demandes.enAttente },
                  { statut: "APPROUVE", count: stats.demandes.approuvees },
                  { statut: "REJETE", count: stats.demandes.rejetee },
                  { statut: "SIGNEE", count: stats.demandes.signee },
                ]}
              />
            </div>
          )}

          {/* Chiffre d'affaires par type de document */}
          {revenueSummary &&
            revenueSummary.byDocumentType.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
                  Chiffre d'affaires par type de document
                </h3>
                <DocumentTypeChart
                  data={revenueSummary.byDocumentType.map((item) => ({
                    documentType: item.documentType,
                    count: item.count,
                    montantTotal: item.revenue,
                  }))}
                  showAmount={true}
                />
              </div>
            )}

          {/* Top établissements */}
          {topEtablissements.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-6">
                Top établissements
              </h3>
              <div className="space-y-4">
                {topEtablissements.map((etab, i) => (
                  <Link
                    key={etab.etablissement.id}
                    href={GOVERNMENT_ROUTES.UNIVERSITY_DETAIL(
                      etab.etablissement.id
                    )}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-800 group-hover:text-emerald-700">
                          {etab.etablissement.nom}
                        </span>
                        <span className="text-xs text-slate-500">
                          {etab.demandesSignees} demandes
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          {etab.etablissement.type}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {formatAmount(etab.chiffreAffaires)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar avec résumé */}
        <div className="xl:col-span-1 space-y-6">
          {/* Résumé chiffre d'affaires */}
          {revenueSummary && (
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-xl p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <h3 className="font-serif font-bold text-xl mb-1 relative z-10">
                Résumé financier
              </h3>
              <p className="text-emerald-200/80 text-sm mb-6 relative z-10">
                {revenueSummary.period}
              </p>
              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-emerald-200/80 text-xs mb-1">
                    Chiffre d'affaires total
                  </p>
                  <p className="text-3xl font-bold">
                    {formatAmount(revenueSummary.totalRevenue)}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-emerald-200/80 text-xs mb-2">
                    Par type de document
                  </p>
                  <div className="space-y-2">
                    {revenueSummary.byDocumentType
                      .slice(0, 5)
                      .map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-emerald-100 truncate flex-1 mr-2">
                            {item.documentType}
                          </span>
                          <span className="font-bold">
                            {formatAmount(item.revenue)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistiques établissements */}
          {stats && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
                Statistiques établissements
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.etablissements.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Actifs</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {stats.etablissements.actifs}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    Total demandes
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.etablissements.totalDemandes.toLocaleString()}
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Montant total dû
                    </span>
                    <span className="text-sm font-bold text-orange-700">
                      {formatAmount(stats.etablissements.montantTotalDu)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
