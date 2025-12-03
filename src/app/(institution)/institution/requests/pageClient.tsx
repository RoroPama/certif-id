"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Ban,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useRequests } from "../hooks/useRequests";
import PaginationControls from "../components/PaginationControls";
import EmptyState from "../components/EmptyState";
import { INSTITUTION_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { SubmittedRequest } from "../types";

interface RequestsPageClientProps {
  initialHistoryData: SubmittedRequest[];
}

export default function RequestsPageClient({
  initialHistoryData,
}: RequestsPageClientProps) {
  const {
    paginatedHistory,
    historyPage,
    totalPages,
    historyFilterType,
    handleFilterChange,
    handlePageChange,
  } = useRequests({ initialData: initialHistoryData });

  const { requests } = MESSAGES.institution.pages;
  const { status } = MESSAGES;

  // Afficher l'état vide si aucune donnée
  if (paginatedHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <h3 className="font-serif font-bold text-lg text-slate-900">
            {requests.tableTitle}
          </h3>
        </div>
        <EmptyState
          title="Aucune demande trouvée"
          message="Vous n'avez pas encore soumis de demande de signature."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <h3 className="font-serif font-bold text-lg text-slate-900">
          {requests.tableTitle}
        </h3>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none"
            value={historyFilterType}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">{requests.filters.all}</option>
            <option value="attention">{requests.filters.attention}</option>
            <option value="completed">{requests.filters.completed}</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">
                {requests.columns.reference}
              </th>
              <th className="px-6 py-4 text-left">{requests.columns.date}</th>
              <th className="px-6 py-4 text-left">
                {requests.columns.summary}
              </th>
              <th className="px-6 py-4 text-left">{requests.columns.status}</th>
              <th className="px-6 py-4 text-right">
                {requests.columns.details}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedHistory.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 border border-blue-100 px-2 py-1 rounded text-xs">
                    {req.reference}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {req.submissionDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> {req.approvedCount}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      <Clock className="w-3 h-3" /> {req.pendingCount}
                    </span>
                    {req.rejectedCount > 0 && (
                      <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                        <Ban className="w-3 h-3" /> {req.rejectedCount}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {req.rejectedCount > 0 ? (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />{" "}
                      {status.attentionRequired}
                    </span>
                  ) : req.pendingCount > 0 ? (
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {status.processing}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {status.finalized}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={INSTITUTION_ROUTES.REQUEST_DETAIL(req.id)}
                    className="text-blue-900 hover:bg-blue-100 p-2 rounded-full transition-colors inline-flex"
                    title="Voir la liste des documents"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        currentPage={historyPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
