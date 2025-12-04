"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Eye,
} from "lucide-react";
import type { ApprovedDiploma } from "../../types";
import PdfViewer from "@/components/ui/PdfViewer";

interface DiplomaDetailPageClientProps {
  diploma: ApprovedDiploma;
}

export default function DiplomaDetailPageClient({
  diploma,
}: DiplomaDetailPageClientProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in zoom-in duration-300">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/registry"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au registre
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Dossier {diploma.serialNumber}
            </h3>
            <p className="text-xs text-slate-500">Document original certifié</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-950 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 flex items-center gap-2 text-sm transition-colors">
            <Download className="w-4 h-4" /> Télécharger
          </button>
          <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Colonne Gauche: Métadonnées */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-900" />
              Métadonnées
            </h3>
          </div>
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Récipiendaire
              </h4>
              <div>
                <p className="text-sm text-slate-500">Nom Complet</p>
                <p className="font-medium text-slate-900 text-lg">
                  {diploma.studentName}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Cursus Académique
              </h4>
              <div>
                <p className="text-sm text-slate-500">Intitulé du Diplôme</p>
                <p className="font-medium text-blue-900">
                  {diploma.diplomaTitle}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Filière</p>
                <p className="font-medium text-slate-800">{diploma.filiere}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Promotion</p>
                  <p className="font-medium text-slate-800">{diploma.year}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Mention</p>
                  <span className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded font-bold mt-1">
                    {diploma.mention}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Certification
              </h4>
              <div>
                <p className="text-sm text-slate-500">Numéro de Série Unique</p>
                <p className="font-mono text-sm font-bold text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mt-1">
                  {diploma.serialNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date d'émission</p>
                <p className="font-medium text-slate-800">
                  {diploma.issueDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Statut</p>
                <div className="mt-1">
                  {diploma.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Valide & Authentique
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      Révoqué
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
            emptyStateMessage="Aperçu du document"
            emptyStateDescription="Fichier original uploadé par l'établissement"
          />
        </div>
      </div>
    </div>
  );
}

