"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,

  MoreHorizontal,
  GraduationCap,
  MapPin,
  Download,

  Upload,

} from "lucide-react";
import { PaginationControls } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useUniversities } from "../hooks";
import CreateUniversityModal from "./CreateUniversityModal";
import ImportEtablissementsModal from "./ImportEtablissementsModal";

export default function UniversitiesPageClient() {
  const {
    universities,
    totalCount,
    currentPage,
    totalPages,
    search,
    typeFilter,
    isLoading,
    error,
    handleSearchChange,
    handleTypeFilterChange,
    handlePageChange,
    addUniversity,
    refreshUniversities,
  } = useUniversities();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { government } = MESSAGES;

  // Badge de statut "Premium"
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3 h-3" /> Actif
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-100">
            <Clock className="w-3 h-3" /> En attente
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-100">
            <AlertTriangle className="w-3 h-3" /> Suspendu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-50 text-slate-600 border border-slate-200">
            Inconnu
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-medium text-slate-900">
            Réseau Académique
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Gestion des accréditations et suivi des {totalCount} établissements
            d'enseignement supérieur agréés.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-slate-800 transition-all rounded-sm shadow-lg shadow-slate-900/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel Établissement
          </button>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un établissement, un recteur..."
              className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={MESSAGES.common.search}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none w-64"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={typeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
            >
              <option value="all">
                {government.pages.universities.filters.allTypes}
              </option>
              <option value="PUBLIC">
                {government.pages.universities.filters.public}
              </option>
              <option value="PRIVE">
                {government.pages.universities.filters.private}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau "Annuaire" */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-slate-500 font-medium">
              Chargement du répertoire...
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : universities.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Aucun établissement trouvé</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                  Institution
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                  Direction & Contact
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans text-right">
                  Volume
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans text-center">
                  Statut
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {universities.map((university) => (
                <tr
                  key={university.id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 w-10 h-10 rounded flex items-center justify-center border text-xs font-bold shadow-sm ${
                          university.type === "PUBLIC"
                            ? "bg-slate-50 border-slate-200 text-slate-700"
                            : "bg-indigo-50 border-indigo-100 text-indigo-700"
                        }`}
                      >
                        {university.type === "PUBLIC" ? "PUB" : "PRI"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 font-serif mb-1 group-hover:text-blue-900 transition-colors">
                          {university.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {university.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 align-top">
                    <p className="text-sm font-medium text-slate-800 mb-0.5">
                      {university.rector}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {university.email}
                    </p>
                  </td>

                  <td className="px-6 py-5 align-top text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="text-lg font-bold text-slate-900 leading-none">
                        {university.diplomaCount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wide">
                        Diplômes
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 align-top text-center">
                    <StatusBadge status={university.status} />
                  </td>

                  <td className="px-6 py-5 align-middle text-right">
                    <Link
                      href={GOVERNMENT_ROUTES.UNIVERSITY_DETAIL(university.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modale de création */}
      {showCreateModal && (
        <CreateUniversityModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            try {
              setIsSubmitting(true);
              await addUniversity(data);
              setShowCreateModal(false);
            } catch (err) {
              console.error("Erreur:", err);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}

      {showImportModal && (
        <ImportEtablissementsModal
          onClose={() => setShowImportModal(false)}
          onSuccess={async () => {
            // Recharger la liste des établissements
            await refreshUniversities();
          }}
        />
      )}
    </div>
  );
}
