"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  User,
  GraduationCap,
  Calendar,
  Eye,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { useCertifications } from "../../hooks";
import type { CertificationRequest } from "../../types";

interface CertificationDetailPageClientProps {
  requestId: string;
}

export default function CertificationDetailPageClient({
  requestId,
}: CertificationDetailPageClientProps) {
  const {
    getRequestById,
    getRequestStats,
    updateItemStatus,
    bulkValidateItems,
    bulkRejectItems,
  } = useCertifications();

  const [request, setRequest] = useState<CertificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { government } = MESSAGES;
  const detailMsg = government.pages.certifications.detail;

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRequestById(requestId);
        if (data) {
          setRequest(data);
        } else {
          setError("Demande non trouvée");
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [requestId, getRequestById]);

  // Refresh request data after updates
  const refreshRequest = async () => {
    try {
      const data = await getRequestById(requestId);
      if (data) setRequest(data);
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-500">{MESSAGES.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-slate-700 font-medium">{error || "Demande non trouvée"}</p>
        </div>
      </div>
    );
  }

  const stats = getRequestStats(request);

  const handleValidate = async (itemId: string) => {
    try {
      await updateItemStatus(requestId, itemId, "APPROVED");
      await refreshRequest();
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      alert("Erreur lors de la validation. Veuillez réessayer.");
    }
  };

  const handleReject = async (itemId: string) => {
    if (rejectReason.trim()) {
      try {
        await updateItemStatus(requestId, itemId, "REJECTED", rejectReason);
        setShowRejectModal(null);
        setRejectReason("");
        await refreshRequest();
      } catch (err) {
        console.error("Erreur lors du rejet:", err);
        alert("Erreur lors du rejet. Veuillez réessayer.");
      }
    }
  };

  const handleBulkValidate = async () => {
    try {
      await bulkValidateItems(requestId);
      await refreshRequest();
    } catch (err) {
      console.error("Erreur lors de l'approbation en masse:", err);
      alert("Erreur lors de l'approbation en masse. Veuillez réessayer.");
    }
  };

  const handleBulkReject = async () => {
    if (rejectReason.trim()) {
      try {
        await bulkRejectItems(requestId, rejectReason);
        setShowBulkRejectModal(false);
        setRejectReason("");
        await refreshRequest();
      } catch (err) {
        console.error("Erreur lors du rejet en masse:", err);
        alert("Erreur lors du rejet en masse. Veuillez réessayer.");
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const hasPendingItems = request.items.some((i) => i.status === "PENDING");

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={GOVERNMENT_ROUTES.CERTIFICATIONS}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">
                    {detailMsg.title} {detailMsg.reference} {request.reference}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 className="w-4 h-4" />
                    <span>{request.universityName}</span>
                    <span className="text-slate-300">•</span>
                    <span>{request.submissionDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {hasPendingItems && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkValidate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {detailMsg.bulkValidate}
                </button>
                <button
                  onClick={() => setShowBulkRejectModal(true)}
                  className="px-4 py-2 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-rose-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  {detailMsg.bulkReject}
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-slate-600">
                {detailMsg.validated}:{" "}
                <span className="font-bold text-emerald-700">
                  {stats.approved}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-sm text-slate-600">
                {detailMsg.rejected}:{" "}
                <span className="font-bold text-rose-700">{stats.rejected}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-slate-600">
                {MESSAGES.status.pending}:{" "}
                <span className="font-bold text-amber-700">{stats.pending}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">{detailMsg.columns.detail}</th>
                <th className="px-6 py-4 text-left">{detailMsg.columns.student}</th>
                <th className="px-6 py-4 text-left">{detailMsg.columns.diploma}</th>
                <th className="px-6 py-4 text-left">{detailMsg.columns.mention}</th>
                <th className="px-6 py-4 text-center">{detailMsg.columns.status}</th>
                <th className="px-6 py-4 text-center">Détails</th>
                <th className="px-6 py-4 text-right">{detailMsg.columns.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {request.items.map((item) => (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    item.status === "PENDING"
                      ? "bg-amber-50/30 hover:bg-amber-50/50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">
                      {item.lastName} {item.firstName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.matricule || "N/A"} •{" "}
                      {detailMsg.promo} {item.promotion}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{item.diplomaTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                      {item.mention}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === "APPROVED" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        {MESSAGES.status.approved}
                      </span>
                    )}
                    {item.status === "REJECTED" && (
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          {MESSAGES.status.rejected}
                        </span>
                        {item.rejectionReason && (
                          <p className="text-xs text-rose-500 mt-1 max-w-[150px] truncate">
                            {item.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                    {item.status === "PENDING" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        {detailMsg.toProcess}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/government/certifications/${requestId}/documents/${item.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleValidate(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          {detailMsg.validate}
                        </button>
                        <button
                          onClick={() => setShowRejectModal(item.id)}
                          className="px-3 py-1.5 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-50 transition-colors"
                        >
                          {detailMsg.reject}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {detailMsg.processed}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {government.pages.certifications.rejectionModal.title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {government.pages.certifications.rejectionModal.description}
            </p>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
              rows={3}
              placeholder={
                government.pages.certifications.rejectionModal.placeholder
              }
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                {MESSAGES.common.cancel}
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {government.pages.certifications.rejectionModal.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reject Modal */}
      {showBulkRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {government.pages.certifications.bulkRejectionModal.title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {government.pages.certifications.bulkRejectionModal.description}
            </p>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
              rows={3}
              placeholder={
                government.pages.certifications.bulkRejectionModal.placeholder
              }
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowBulkRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                {MESSAGES.common.cancel}
              </button>
              <button
                onClick={handleBulkReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {government.pages.certifications.bulkRejectionModal.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

