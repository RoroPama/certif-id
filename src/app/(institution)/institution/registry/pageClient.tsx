"use client";

import React from "react";
import Link from "next/link";
import { Search, CheckCircle2, Eye } from "lucide-react";
import { useRegistry } from "../hooks/useRegistry";
import PaginationControls from "../components/PaginationControls";
import { INSTITUTION_ROUTES, DIPLOMA_STATUS } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { ApprovedDiploma } from "../types";

interface RegistryPageClientProps {
  initialRegistryData: ApprovedDiploma[];
}

export default function RegistryPageClient({
  initialRegistryData,
}: RegistryPageClientProps) {
  const {
    paginatedRegistry,
    registryPage,
    totalPages,
    registrySearch,
    handleSearchChange,
    handlePageChange,
  } = useRegistry({ initialData: initialRegistryData });

  const { registry } = MESSAGES.institution.pages;
  const { status } = MESSAGES;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <h3 className="font-serif font-bold text-lg text-slate-900">
          {registry.title}
        </h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={MESSAGES.common.search + "..."}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900/10 outline-none w-64"
              value={registrySearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">{registry.columns.serialNumber}</th>
              <th className="px-6 py-4 text-left">{registry.columns.recipient}</th>
              <th className="px-6 py-4 text-left">{registry.columns.title}</th>
              <th className="px-6 py-4 text-left">{registry.columns.status}</th>
              <th className="px-6 py-4 text-right">{registry.columns.details}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRegistry.map((dip) => (
              <tr
                key={dip.id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {dip.serialNumber}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  {dip.studentName}
                </td>
                <td className="px-6 py-4 text-blue-900 font-medium">
                  {dip.diplomaTitle}
                </td>
                <td className="px-6 py-4">
                  {dip.status === DIPLOMA_STATUS.ACTIVE ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {status.active}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      {status.revoked}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={INSTITUTION_ROUTES.REGISTRY_DETAIL(dip.id)}
                    className="text-slate-400 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors inline-flex"
                    title={registry.columns.details}
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        currentPage={registryPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
