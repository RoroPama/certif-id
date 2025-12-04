"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Database,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
  Filter,
} from "lucide-react";
import { PaginationControls, SearchableSelect } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { RegistryEntry } from "../types";

interface RegistryPageClientProps {
  initialRegistryData: RegistryEntry[];
}

const ITEMS_PER_PAGE = 10;

export default function RegistryPageClient({
  initialRegistryData,
}: RegistryPageClientProps) {
  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Extraire les universités uniques depuis les données
  const universities = useMemo(() => {
    const uniqueUniversities = new Map<string, string>();
    initialRegistryData.forEach((entry) => {
      if (!uniqueUniversities.has(entry.universityName)) {
        uniqueUniversities.set(entry.universityName, entry.universityName);
      }
    });
    return Array.from(uniqueUniversities.entries()).map(([name], index) => ({
      id: `univ-${index}`,
      name,
    }));
  }, [initialRegistryData]);

  // Extraire les années uniques depuis les données
  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    initialRegistryData.forEach((entry) => {
      uniqueYears.add(entry.year);
    });
    return Array.from(uniqueYears).sort().reverse();
  }, [initialRegistryData]);

  // Filtrer les entrées
  const filteredEntries = useMemo(() => {
    return initialRegistryData.filter((entry) => {
      // Filtre par recherche
      const matchesSearch =
        search === "" ||
        entry.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        entry.studentName.toLowerCase().includes(search.toLowerCase()) ||
        entry.diplomaTitle.toLowerCase().includes(search.toLowerCase());

      // Filtre par université
      const matchesUniversity =
        universityFilter === "all" || entry.universityName === universityFilter;

      // Filtre par année
      const matchesYear = yearFilter === "all" || entry.year === yearFilter;

      // Filtre par statut
      const matchesStatus =
        statusFilter === "all" || entry.status === statusFilter;

      return matchesSearch && matchesUniversity && matchesYear && matchesStatus;
    });
  }, [initialRegistryData, search, universityFilter, yearFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const entries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleUniversityFilterChange = useCallback((value: string) => {
    setUniversityFilter(value);
    setCurrentPage(1);
  }, []);

  const handleYearFilterChange = useCallback((value: string) => {
    setYearFilter(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setUniversityFilter("all");
    setYearFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  }, []);

  const { government } = MESSAGES;
  const registryMsg = government.pages.registry;

  const universityOptions = universities.map((u) => ({
    value: u.name,
    label: u.name,
  }));
  const yearOptions = years.map((y) => ({ value: y, label: y }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {registryMsg.listTitle}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {registryMsg.listDescription}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                {registryMsg.exportButton}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={MESSAGES.common.search}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="w-48">
              <SearchableSelect
                options={universityOptions}
                value={universityFilter}
                onChange={handleUniversityFilterChange}
                placeholder="Université"
                icon={Building2}
                allOptionLabel="Toutes"
              />
            </div>
            <div className="w-36">
              <SearchableSelect
                options={yearOptions}
                value={yearFilter}
                onChange={handleYearFilterChange}
                placeholder="Année"
                allOptionLabel="Toutes"
              />
            </div>
            <select
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="all">Tous statuts</option>
              <option value="VALIDE">{MESSAGES.status.active}</option>
              <option value="REVOQUE">{MESSAGES.status.revoked}</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Réinitialiser les filtres"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">
                {registryMsg.columns.serialNumber}
              </th>
              <th className="px-6 py-4 text-left">
                {registryMsg.columns.recipient}
              </th>
              <th className="px-6 py-4 text-left">
                {registryMsg.columns.university}
              </th>
              <th className="px-6 py-4 text-left">{registryMsg.columns.title}</th>
              <th className="px-6 py-4 text-left">
                {registryMsg.columns.issueDate}
              </th>
              <th className="px-6 py-4 text-center">
                {registryMsg.columns.status}
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-emerald-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold text-slate-900">
                      {entry.serialNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{entry.studentName}</p>
                  <p className="text-xs text-slate-500">
                    {entry.filiere} • {entry.promotion}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700">{entry.universityName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700">{entry.diplomaTitle}</span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                    {entry.mention}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-500">{entry.issueDate}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {entry.status === "VALIDE" ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1 justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                      {MESSAGES.status.active}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 flex items-center gap-1 justify-center">
                      <XCircle className="w-3 h-3" />
                      {MESSAGES.status.revoked}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={GOVERNMENT_ROUTES.REGISTRY_DETAIL(entry.id)}
                    className="text-emerald-700 hover:bg-emerald-100 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Database className="w-16 h-16 opacity-20 mb-4" />
            <p className="text-lg font-medium">{MESSAGES.common.noResults}</p>
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

