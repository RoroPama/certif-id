"use client";

import React from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Building2,
  GraduationCap,
  Calendar,
  Eye,
} from "lucide-react";
import { PaginationControls } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { useGovernmentRegistry } from "../hooks";
import type { RegistryEntry } from "../types";

interface RegistryPageClientProps {
  initialRegistryData: RegistryEntry[];
}

export default function RegistryPageClient({
  initialRegistryData,
}: RegistryPageClientProps) {
  const {
    entries,
    totalCount,
    currentPage,
    totalPages,
    search,
    universityFilter,
    yearFilter,
    statusFilter,
    universities,
    years,
    handleSearchChange,
    handleUniversityFilterChange,
    handleYearFilterChange,
    handleStatusFilterChange,
    handlePageChange,
  } = useGovernmentRegistry({ initialData: initialRegistryData });

  // Badge de statut
  const StatusBadge = ({ status }: { status: "VALIDE" | "REVOQUE" }) => {
    if (status === "VALIDE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" /> Valide
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-100">
        <XCircle className="w-3 h-3" /> Révoqué
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-medium text-slate-900">
            Registre National
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl leading-relaxed">
            Consultation de tous les diplômes certifiés et signés
            électroniquement.
            {totalCount > 0 && (
              <span className="ml-2 font-medium text-slate-700">
                {totalCount.toLocaleString()} document
                {totalCount > 1 ? "s" : ""} enregistré
                {totalCount > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide hover:border-slate-300 hover:text-slate-900 transition-all rounded-sm shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro de série, nom d'étudiant, diplôme..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Filtre Université */}
          <select
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[200px]"
            value={universityFilter}
            onChange={(e) => handleUniversityFilterChange(e.target.value)}
          >
            <option value="all">Toutes les universités</option>
            {universities.map((u: { id: string; name: string }) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Filtre Année */}
          <select
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[120px]"
            value={yearFilter}
            onChange={(e) => handleYearFilterChange(e.target.value)}
          >
            <option value="all">Toutes les années</option>
            {years.map((year: string) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Filtre Statut */}
          <select
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[140px]"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="VALIDE">Valide</option>
            <option value="REVOQUE">Révoqué</option>
          </select>
        </div>
      </div>

      {/* Tableau des documents */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {entries.length === 0 ? (
          <div className="py-20 text-center">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucun document trouvé</p>
            <p className="text-xs text-slate-400 mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Numéro de Série
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Bénéficiaire
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Établissement
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Diplôme
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Parcours
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Date d&apos;Émission
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
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-5 align-top">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {entry.serialNumber}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-medium text-slate-900">
                        {entry.studentName}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">
                          {entry.universityName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">
                          {entry.diplomaTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="text-sm text-slate-600">
                        {entry.parcours}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {entry.issueDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top text-center">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                      <Link
                        href={GOVERNMENT_ROUTES.REGISTRY_DETAIL(entry.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
