"use client";

import React from "react";
import Link from "next/link";
import {
  FileCheck,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { PaginationControls } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useCertifications } from "../hooks";

export default function CertificationsPageClient() {
  const {
    requests,
    currentPage,
    totalPages,
    filter,
    isLoading,
    error,
    handleFilterChange,
    handlePageChange,
    getRequestStats,
  } = useCertifications();

  const { government } = MESSAGES;
  const certMsg = government.pages.certifications;

  // Badge de statut "Premium"
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
      PARTIAL: "bg-amber-50 text-amber-700 border-amber-100",
      PENDING: "bg-slate-50 text-slate-600 border-slate-200",
    };

    const icons = {
      COMPLETED: CheckCircle2,
      PARTIAL: AlertCircle,
      PENDING: Clock,
    };

    const Icon = icons[status as keyof typeof icons] || Clock;
    const style = styles[status as keyof typeof styles] || styles.PENDING;
    const label =
      status === "COMPLETED"
        ? MESSAGES.status.finalized
        : status === "PARTIAL"
        ? "Partiel"
        : MESSAGES.status.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${style}`}
      >
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* En-tête de section avec Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-medium text-slate-900">
            {certMsg.listTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez les flux de validation des titres académiques.
          </p>
        </div>

        {/* Barre d'outils */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            {[
              { id: "all", label: certMsg.filters.all },
              { id: "pending", label: certMsg.filters.pending },
              { id: "completed", label: certMsg.filters.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filter === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* État de chargement / Erreur */}
      {isLoading && (
        <div className="py-20 text-center">
          <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-slate-500 font-medium">
            Récupération des dossiers...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Liste des demandes */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {requests.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                Aucune demande trouvée
              </p>
            </div>
          ) : (
            requests.map((request) => {
              const stats = getRequestStats(request);
              const progressPercent = Math.round(
                (request.processedCount / request.totalStudents) * 100
              );

              return (
                <Link
                  key={request.id}
                  href={GOVERNMENT_ROUTES.CERTIFICATION_DETAIL(request.id)}
                  className="group block bg-white border border-slate-200 rounded-lg p-5 transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Info Principale */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {request.reference}
                        </span>
                        <StatusBadge status={request.status} />
                        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto md:ml-0">
                          <Clock className="w-3 h-3" /> {request.submissionDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-md border border-slate-100 group-hover:bg-slate-100 transition-colors">
                          <Building2 className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-900 transition-colors">
                            {request.universityName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Établissement enregistré
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Métriques & Progression */}
                    <div className="flex items-center gap-8 md:border-l md:border-slate-100 md:pl-8 w-full md:w-auto">
                      <div className="flex flex-col gap-1 min-w-[100px]">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Traitement
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              request.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : "bg-slate-800"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-3 mt-1.5 text-[10px] font-medium text-slate-500">
                          <span>
                            {request.processedCount} / {request.totalStudents}{" "}
                            traités
                          </span>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col items-end gap-1 text-right min-w-[80px]">
                        <span className="text-2xl font-serif text-slate-900 leading-none">
                          {request.totalStudents}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Candidats
                        </span>
                      </div>

                      <div className="text-slate-300 group-hover:text-slate-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
