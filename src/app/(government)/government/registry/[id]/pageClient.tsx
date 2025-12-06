"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  User,
  GraduationCap,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import PdfViewer from "@/components/ui/PdfViewer";
import type { RegistryEntry } from "../../types";

interface RegistryDetailPageClientProps {
  entry: RegistryEntry;
  pdfSigneUrl: string;
  pdfOriginalUrl?: string | null;
}

export default function RegistryDetailPageClient({
  entry,
  pdfSigneUrl,
  pdfOriginalUrl,
}: RegistryDetailPageClientProps) {
  const { government } = MESSAGES;
  const detailMsg = government.pages.registry.detail;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={GOVERNMENT_ROUTES.REGISTRY}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> {detailMsg.backToRegistry}
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {entry.serialNumber}
            </h3>
            <p className="text-xs text-slate-500">{detailMsg.documentInfo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            {detailMsg.download}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" />
            {detailMsg.print}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Metadata Panel */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {detailMsg.metadata}
            </h4>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-400px)]">
            {/* Récipiendaire */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-3 h-3" />
                {detailMsg.sections.recipient}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.fullName}
                  </p>
                  <p className="font-bold text-slate-900">
                    {entry.studentName}
                  </p>
                </div>
              </div>
            </div>

            {/* Cursus Académique */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="w-3 h-3" />
                {detailMsg.sections.academic}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.diplomaTitle}
                  </p>
                  <p className="font-bold text-slate-900">
                    {entry.diplomaTitle}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.university}
                  </p>
                  <p className="font-medium text-slate-700">
                    {entry.universityName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Parcours</p>
                    <p className="font-medium text-slate-700">
                      {entry.parcours}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">
                      {detailMsg.fields.promotion}
                    </p>
                    <p className="font-medium text-slate-700">
                      {entry.promotion}
                    </p>
                  </div>
                </div>
                {entry.mention && entry.mention !== "N/A" && (
                  <div>
                    <p className="text-xs text-slate-500">
                      {detailMsg.fields.mention}
                    </p>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-bold">
                      {entry.mention}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Authentification */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-3 h-3" />
                {detailMsg.sections.authentication}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.serialNumber}
                  </p>
                  <p className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                    {entry.serialNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.issueDate}
                  </p>
                  <p className="font-medium text-slate-700">
                    {entry.issueDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {detailMsg.fields.status}
                  </p>
                  {entry.status === "VALIDE" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {MESSAGES.status.active}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold">
                      <XCircle className="w-4 h-4" />
                      {MESSAGES.status.revoked}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h4 className="font-bold text-slate-800">
              {detailMsg.preview.title}
            </h4>
            <p className="text-xs text-slate-500">
              {detailMsg.preview.description}
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <PdfViewer
              signedPdfUrl={pdfSigneUrl}
              originalPdfUrl={pdfOriginalUrl || undefined}
              fileName={`${entry.studentName}_${entry.diplomaTitle}.pdf`}
              emptyStateMessage="Document non disponible"
              emptyStateDescription="Le document PDF n'est pas disponible pour le moment."
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

