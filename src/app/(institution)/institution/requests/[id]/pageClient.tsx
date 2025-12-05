"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Ban, Eye } from "lucide-react";
import { INSTITUTION_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { SubmittedRequest } from "../../types";

interface RequestDetailPageClientProps {
  request: SubmittedRequest;
}

export default function RequestDetailPageClient({
  request,
}: RequestDetailPageClientProps) {
  const { requestDetail } = MESSAGES.institution.pages;
  const { status } = MESSAGES;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={INSTITUTION_ROUTES.REQUESTS}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-500 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {requestDetail.bordereau} {request.reference}
            </h3>
            <p className="text-sm text-slate-500">
              {request.documents.length} {requestDetail.students} •{" "}
              {requestDetail.submittedOn} {request.submissionDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {requestDetail.validated}
            </span>
            <span className="text-lg font-bold text-emerald-600 leading-none">
              {request.approvedCount}
            </span>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {requestDetail.rejected}
            </span>
            <span className="text-lg font-bold text-rose-600 leading-none">
              {request.rejectedCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <table className="w-full text-sm">
          <thead className="text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">
                {requestDetail.columns.student}
              </th>
              <th className="px-4 py-3 text-left">
                {requestDetail.columns.diploma}
              </th>
              <th className="px-4 py-3 text-left">
                {requestDetail.columns.status}
              </th>
              <th className="px-4 py-3 text-left">
                {requestDetail.columns.observation}
              </th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {request.documents.map((doc) => {
              const studentName = `${doc.nomBeneficiaire} ${doc.prenomBeneficiaire}`;
              const rejectionReason =
                doc.raisonRejet || doc.commentaireRejet || "";
              const isApproved = doc.status === "APPROUVE";
              const isRejected = doc.status === "REJETE";
              const isPending = doc.status === null;

              return (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {studentName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {doc.documentTypeNom}
                  </td>
                  <td className="px-4 py-3">
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> {status.approved}
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3 h-3" /> {status.pending}
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        <Ban className="w-3 h-3" /> {status.rejected}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isRejected && rejectionReason ? (
                      <span className="text-rose-600 text-xs font-medium">
                        {rejectionReason}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`${INSTITUTION_ROUTES.REQUEST_DETAILS(
                        request.id
                      )}?documentId=${doc.id}`}
                      className="text-blue-900 hover:bg-blue-100 p-2 rounded-full transition-colors inline-flex"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
