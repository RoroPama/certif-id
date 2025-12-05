"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { INSTITUTION_ROUTES, DIPLOMA_STATUS } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { ApprovedDiploma } from "../../types";
import PdfViewer from "@/components/ui/PdfViewer";

interface DiplomaDetailPageClientProps {
  diploma: ApprovedDiploma;
}

export default function DiplomaDetailPageClient({
  diploma,
}: DiplomaDetailPageClientProps) {
  const { registryDetail } = MESSAGES.institution.pages;
  const { status } = MESSAGES;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in zoom-in duration-300">
      {/* Page Title and Breadcrumbs */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Détail du Diplôme
        </h1>
        <nav className="text-sm text-slate-600">
          <span className="text-slate-500">Espace Université</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-700 font-medium">Détail diplôme</span>
        </nav>
      </div>

      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={INSTITUTION_ROUTES.REGISTRY}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> {registryDetail.backToRegistry}
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Dossier {diploma.serialNumber}
            </h3>
            <p className="text-xs text-slate-500">
              {registryDetail.documentInfo}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {diploma.pdfSigneUrl && (
            <a
              href={diploma.pdfSigneUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-950 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 flex items-center gap-2 text-sm transition-colors"
            >
              <Download className="w-4 h-4" /> {registryDetail.actions.download}
            </a>
          )}
          {diploma.pdfSigneUrl && (
            <button
              onClick={() => window.open(diploma.pdfSigneUrl, "_blank")}
              className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors"
            >
              <Printer className="w-4 h-4" /> {registryDetail.actions.print}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Colonne Gauche: Métadonnées */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-900" />
              {registryDetail.metadata}
            </h3>
          </div>
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                {registryDetail.sections.recipient}
              </h4>
              <div>
                <p className="text-sm text-slate-500">
                  {registryDetail.fields.fullName}
                </p>
                <p className="font-medium text-slate-900 text-lg">
                  {diploma.studentName}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                {registryDetail.sections.academic}
              </h4>
              <div>
                <p className="text-sm text-slate-500">
                  {registryDetail.fields.diplomaTitle}
                </p>
                <p className="font-medium text-blue-900">
                  {diploma.diplomaTitle}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  {registryDetail.fields.filiere}
                </p>
                <p className="font-medium text-slate-800">{diploma.filiere}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    {registryDetail.fields.promotion}
                  </p>
                  <p className="font-medium text-slate-800">{diploma.year}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">
                    {registryDetail.fields.mention}
                  </p>
                  <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded font-bold mt-1">
                    {diploma.mention}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                {registryDetail.sections.certification}
              </h4>
              <div>
                <p className="text-sm text-slate-500">
                  {registryDetail.fields.serialNumber}
                </p>
                <p className="font-mono text-sm font-bold text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mt-1">
                  {diploma.serialNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  {registryDetail.fields.issueDate}
                </p>
                <p className="font-medium text-slate-800">
                  {diploma.issueDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  {registryDetail.fields.status}
                </p>
                <div className="mt-1">
                  {diploma.status === DIPLOMA_STATUS.ACTIVE ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />{" "}
                      {status.validAuthentic}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      {status.revoked}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite: Prévisualisation Fichier */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <PdfViewer
            pdfUrl={diploma.pdfSigneUrl}
            fileName={`${diploma.serialNumber}.pdf`}
            emptyStateMessage={registryDetail.preview.title}
            emptyStateDescription={registryDetail.preview.description}
          />
        </div>
      </div>
    </div>
  );
}
