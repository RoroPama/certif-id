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
} from "lucide-react";
import { PaginationControls } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useUniversities } from "../hooks";
import CreateUniversityModal from "./CreateUniversityModal";

export default function UniversitiesPageClient() {
  const {
    universities,
    totalCount,
    currentPage,
    totalPages,
    search,
    typeFilter,
    handleSearchChange,
    handleTypeFilterChange,
    handlePageChange,
    addUniversity,
  } = useUniversities();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const { government } = MESSAGES;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Actif
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Suspendu
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {government.pages.universities.listTitle}
            </h3>
            <p className="text-sm text-slate-500">
              {totalCount} établissements enregistrés
            </p>
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
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              {government.pages.universities.addButton}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  {government.pages.universities.columns.institution}
                </th>
                <th className="px-6 py-4 text-left">
                  {government.pages.universities.columns.type}
                </th>
                <th className="px-6 py-4 text-left">
                  {government.pages.universities.columns.contact}
                </th>
                <th className="px-6 py-4 text-left">
                  {government.pages.universities.columns.activity}
                </th>
                <th className="px-6 py-4 text-left">
                  {government.pages.universities.columns.status}
                </th>
                <th className="px-6 py-4 text-right">
                  {government.pages.universities.columns.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {universities.map((university) => (
                <tr
                  key={university.id}
                  className="hover:bg-emerald-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {university.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {university.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        university.type === "PUBLIC"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {university.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-900">{university.rector}</p>
                    <p className="text-xs text-slate-500">{university.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">
                      {university.diplomaCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {government.pages.universities.diplomasIssued}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(university.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={GOVERNMENT_ROUTES.UNIVERSITY_DETAIL(university.id)}
                      className="text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-medium"
                    >
                      {government.pages.universities.manage}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {showCreateModal && (
        <CreateUniversityModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => {
            addUniversity(data);
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
}
