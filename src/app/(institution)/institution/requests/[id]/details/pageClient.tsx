"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  Ban,
  Maximize2,
  File,
} from "lucide-react";
import { INSTITUTION_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import type { DocumentDetail } from "@/lib/services/requests.service";

interface RequestDetailsPageClientProps {
  documentDetail: DocumentDetail;
}

export default function RequestDetailsPageClient({
  documentDetail,
}: RequestDetailsPageClientProps) {
  const { status } = MESSAGES;

  const studentName = `${documentDetail.nomBeneficiaire} ${documentDetail.prenomBeneficiaire}`;
  const hasSignedDocument = documentDetail.documentSigne?.pdfSigneUrl;
  const pdfUrl = hasSignedDocument
    ? documentDetail.documentSigne!.pdfSigneUrl
    : documentDetail.pdfOriginalUrl;

  // Formater la date
  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formater la date de soumission de la demande
  const submissionDate = new Date(
    documentDetail.demande.createdAt
  ).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in zoom-in duration-300">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={INSTITUTION_ROUTES.REQUEST_DETAIL(documentDetail.demandeId)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la liste des documents
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Bordereau {documentDetail.demande.reference}
            </h3>
            <p className="text-xs text-slate-500">
              Soumis le {submissionDate} • Document{" "}
              {documentDetail.documentTypeNom}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasSignedDocument && (
            <>
              <button className="bg-blue-950 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 flex items-center gap-2 text-sm transition-colors">
                <Download className="w-4 h-4" /> Télécharger
              </button>
              <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors">
                <Printer className="w-4 h-4" /> Imprimer
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Colonne Gauche: Métadonnées */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-900" />
              Informations
            </h3>
          </div>
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Section: Demande */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Demande
              </h4>
              <div>
                <p className="text-sm text-slate-500">Référence</p>
                <p className="font-mono text-sm font-bold text-slate-900 bg-slate-100 p-2 rounded border border-slate-200 mt-1">
                  {documentDetail.demande.reference}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date de soumission</p>
                <p className="font-medium text-slate-800">{submissionDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Statut de la demande</p>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {documentDetail.demande.statut}
                  </span>
                </div>
              </div>
              {documentDetail.demande.note && (
                <div>
                  <p className="text-sm text-slate-500">Note</p>
                  <p className="font-medium text-slate-800 text-sm">
                    {documentDetail.demande.note}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500">Établissement</p>
                <p className="font-medium text-slate-800">
                  {documentDetail.demande.etablissement.nom}
                </p>
                <p className="text-xs text-slate-500">
                  {documentDetail.demande.etablissement.email}
                </p>
              </div>
            </div>
            {/* Section: Bénéficiaire */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Bénéficiaire
              </h4>
              <div>
                <p className="text-sm text-slate-500">Nom complet</p>
                <p className="font-medium text-slate-900 text-lg">
                  {studentName}
                </p>
              </div>
              {documentDetail.matricule && (
                <div>
                  <p className="text-sm text-slate-500">Matricule</p>
                  <p className="font-medium text-slate-800">
                    {documentDetail.matricule}
                  </p>
                </div>
              )}
              {documentDetail.dateNaissance && (
                <div>
                  <p className="text-sm text-slate-500">Date de naissance</p>
                  <p className="font-medium text-slate-800">
                    {formatDate(documentDetail.dateNaissance)}
                  </p>
                </div>
              )}
              {documentDetail.lieuNaissance && (
                <div>
                  <p className="text-sm text-slate-500">Lieu de naissance</p>
                  <p className="font-medium text-slate-800">
                    {documentDetail.lieuNaissance}
                  </p>
                </div>
              )}
            </div>

            {/* Section: Document */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Document
              </h4>
              <div>
                <p className="text-sm text-slate-500">Type de document</p>
                <p className="font-medium text-blue-900">
                  {documentDetail.documentTypeNom}
                </p>
                {documentDetail.documentTypeDescription && (
                  <p className="text-xs text-slate-500 mt-1">
                    {documentDetail.documentTypeDescription}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">Date d&apos;émission</p>
                <p className="font-medium text-slate-800">
                  {formatDate(documentDetail.dateEmission)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Émetteur</p>
                <p className="font-medium text-slate-800">
                  {documentDetail.emetteur}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Prix</p>
                <p className="font-medium text-slate-800">
                  {documentDetail.documentTypePrix.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Statut</p>
                <div className="mt-1">
                  {documentDetail.status === "APPROUVE" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {status.approved}
                    </span>
                  )}
                  {documentDetail.status === null && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <Clock className="w-3 h-3" /> {status.pending}
                    </span>
                  )}
                  {documentDetail.status === "REJETE" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <Ban className="w-3 h-3" /> {status.rejected}
                    </span>
                  )}
                </div>
              </div>
              {documentDetail.status === "REJETE" &&
                (documentDetail.raisonRejet ||
                  documentDetail.commentaireRejet) && (
                  <div>
                    <p className="text-sm text-slate-500">Raison du rejet</p>
                    <p className="text-sm text-rose-600 font-medium mt-1">
                      {documentDetail.raisonRejet ||
                        documentDetail.commentaireRejet}
                    </p>
                  </div>
                )}
              {documentDetail.documentSigne && (
                <div>
                  <p className="text-sm text-slate-500">Date de signature</p>
                  <p className="font-medium text-slate-800">
                    {formatDate(documentDetail.documentSigne.createdAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne Droite: Prévisualisation Fichier */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-inner border border-slate-800 flex flex-col overflow-hidden relative group">
          {/* PDF Viewer Toolbar */}
          <div className="bg-slate-950 text-slate-400 px-4 py-3 flex justify-between items-center text-xs border-b border-white/5">
            <div className="flex items-center gap-3">
              <File className="w-4 h-4" />
              <span className="font-mono text-slate-300">
                {`${documentDetail.documentTypeNom.replace(/\s+/g, "_")}_${
                  documentDetail.id
                }.pdf`}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>{MESSAGES.pagination.page} 1 / 1</span>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex gap-2">
                <button className="hover:text-white transition-colors">
                  -
                </button>
                <span>100%</span>
                <button className="hover:text-white transition-colors">
                  +
                </button>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <button
                className="hover:text-white transition-colors"
                title="Plein écran"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PDF Canvas Area */}
          <div className="flex-1 bg-slate-800 overflow-auto flex items-center justify-center p-8 relative">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0 rounded"
                title="Aperçu du document"
              />
            ) : (
              <div className="bg-white w-full max-w-[500px] aspect-[1/1.414] shadow-2xl flex flex-col relative transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-400">
                      Document non disponible
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      {documentDetail.status === null
                        ? "Le document est en attente de traitement"
                        : documentDetail.status === "REJETE"
                        ? "Le document a été rejeté"
                        : "Aucun document disponible"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
