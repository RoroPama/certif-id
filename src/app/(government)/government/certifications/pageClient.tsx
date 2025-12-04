"use client";

import React from "react";
import Link from "next/link";
import {
  FileCheck,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { PaginationControls } from "@/components/shared";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useCertifications } from "../hooks";

export default function CertificationsPageClient() {
  const {
    requests,
    totalCount,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {MESSAGES.status.finalized}
          </span>
        );
      case "PARTIAL":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Partiel
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {MESSAGES.status.pending}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {certMsg.listTitle}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {certMsg.listDescription}
            </p>
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">{certMsg.filters.all}</option>
              <option value="pending">{certMsg.filters.pending}</option>
              <option value="completed">{certMsg.filters.completed}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="flex-1 p-4 space-y-3">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Clock className="w-16 h-16 opacity-20 mb-4 animate-spin" />
            <p className="text-lg font-medium">{MESSAGES.common.loading}</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-rose-500">
            <AlertTriangle className="w-16 h-16 opacity-20 mb-4" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {!isLoading && !error && requests.map((request) => {
          const stats = getRequestStats(request);
          const progressPercent = Math.round(
            (request.processedCount / request.totalStudents) * 100
          );

          return (
            <Link
              key={request.id}
              href={GOVERNMENT_ROUTES.CERTIFICATION_DETAIL(request.id)}
              className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-colors">
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-slate-900 text-lg">
                        {request.reference}
                      </h4>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <Building2 className="w-4 h-4" />
                      <span>{request.universityName}</span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {certMsg.submitted} {request.submissionDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {request.totalStudents}
                    </p>
                    <p className="text-xs text-slate-500">{certMsg.students}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{certMsg.progression}</span>
                  <span className="font-bold">
                    {request.processedCount}/{request.totalStudents} (
                    {progressPercent}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      request.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : request.status === "PARTIAL"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  {stats.approved > 0 && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      {stats.approved} validés
                    </span>
                  )}
                  {stats.rejected > 0 && (
                    <span className="flex items-center gap-1 text-rose-600">
                      <AlertTriangle className="w-3 h-3" />
                      {stats.rejected} rejetés
                    </span>
                  )}
                  {stats.pending > 0 && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {stats.pending} en attente
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {!isLoading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileCheck className="w-16 h-16 opacity-20 mb-4" />
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

