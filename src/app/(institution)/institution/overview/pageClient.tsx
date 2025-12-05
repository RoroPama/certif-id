"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Clock,
  FileClock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  FilePlus,
  Search,
  Users,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { INSTITUTION_ROUTES } from "@/lib/utils/constants";
import {
  MonthlyEvolutionChart,
  DocumentTypeChart,
  StatusChart,
} from "../components/charts";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function OverviewPageClient() {
  const [dateFilter, setDateFilter] = useState<{
    dateDebut?: string;
    dateFin?: string;
  }>({});

  const { overview, stats, reports, loading, error, refetch } = useDashboard({
    filters: dateFilter,
  });

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
    <div className="space-y-6">
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
                value={dateFilter.dateDebut || ""}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, dateDebut: e.target.value })
                }
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">
                Date de fin
              </label>
              <input
                type="date"
                value={dateFilter.dateFin || ""}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, dateFin: e.target.value })
                }
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {(dateFilter.dateDebut || dateFilter.dateFin) && (
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

      {/* Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Utilisateurs",
            value: overview?.totalUsers || 0,
            icon: Users,
            color: "blue",
          },
          {
            title: "Total demandes",
            value: overview?.totalDemandes || 0,
            icon: FileText,
            color: "slate",
          },
          {
            title: "Demandes en attente",
            value: overview?.demandesEnAttente || 0,
            icon: Clock,
            color: "amber",
          },
          {
            title: "Demandes approuvées",
            value: overview?.demandesApprouvees || 0,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            title: "Demandes rejetées",
            value: overview?.demandesRejetees || 0,
            icon: AlertTriangle,
            color: "red",
          },
          {
            title: "Documents signés",
            value: overview?.documentsSignes || 0,
            icon: Award,
            color: "green",
          },
          {
            title: "Coût total",
            value: formatAmount(overview?.coutTotal || 0),
            icon: DollarSign,
            color: "purple",
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        {stats && stats.evolutionMensuelle.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-serif font-bold text-slate-800 text-lg mb-4">
              Évolution mensuelle des demandes
            </h3>
            <MonthlyEvolutionChart data={stats.evolutionMensuelle} />
          </div>
        )}

        {/* Statistiques par statut */}
        {stats && stats.parStatut.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-serif font-bold text-slate-800 text-lg mb-4">
              Répartition par statut
            </h3>
            <StatusChart data={stats.parStatut} />
          </div>
        )}

        {/* Statistiques par type de document */}
        {stats && stats.parTypeDocument.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <h3 className="font-serif font-bold text-slate-800 text-lg mb-4">
              Statistiques par type de document
            </h3>
            <DocumentTypeChart data={stats.parTypeDocument} showAmount={true} />
          </div>
        )}
      </div>

      {/* Section d'activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demandes récentes */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-slate-800 text-lg">
              Demandes récentes
            </h3>
            <Link
              href={INSTITUTION_ROUTES.REQUESTS}
              className="text-sm text-blue-900 font-medium hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {reports?.demandesRecentes &&
            reports.demandesRecentes.length > 0 ? (
              reports.demandesRecentes.map((req) => (
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
                        {req.beneficiaire}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {req.documentType} • {formatDate(req.dateCreation)}
                      </p>
                    </div>
                  </div>
                  {req.statut === "REJETE" ? (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                      <AlertTriangle className="w-3 h-3" /> Rejeté
                    </span>
                  ) : req.statut === "EN_ATTENTE" ? (
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" /> En attente
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Approuvé
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                Aucune demande récente
              </p>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <h3 className="font-serif font-bold text-xl mb-1 relative z-10">
            Actions rapides
          </h3>
          <p className="text-blue-200/80 text-sm mb-8 relative z-10">
            Accédez rapidement aux fonctionnalités principales
          </p>
          <div className="space-y-3 relative z-10">
            <Link
              href={INSTITUTION_ROUTES.NEW_REQUEST}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg p-3 flex items-center gap-3 transition-all group"
            >
              <div className="bg-amber-500/20 p-1.5 rounded text-amber-400 group-hover:text-amber-300">
                <FilePlus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Nouvelle demande</span>
            </Link>
            <Link
              href={INSTITUTION_ROUTES.REGISTRY}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg p-3 flex items-center gap-3 transition-all group"
            >
              <div className="bg-amber-500/20 p-1.5 rounded text-amber-400 group-hover:text-amber-300">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Rechercher</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Documents récents */}
      {reports && reports.documentsRecents.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-slate-800 text-lg">
              Documents récemment signés
            </h3>
            <Link
              href={INSTITUTION_ROUTES.REGISTRY}
              className="text-sm text-blue-900 font-medium hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.documentsRecents.map((doc) => (
              <Link
                key={doc.id}
                href={INSTITUTION_ROUTES.REGISTRY_DETAIL(doc.id)}
                className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 font-serif truncate">
                      {doc.beneficiaire}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {doc.documentType}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Signé le {formatDate(doc.dateSignature)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
