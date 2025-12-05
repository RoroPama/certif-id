"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  Ban,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";
import { governmentService } from "@/lib/services/government.service";
import type { DemandeDocument } from "@/lib/services/requests.service";
import PdfViewer from "@/components/ui/PdfViewer";

interface DocumentDetailPageClientProps {
  documentDetail: DemandeDocument & {
    demande: {
      id: string;
      reference: string;
      statut: string;
      note?: string;
      createdAt: Date | string;
      updatedAt: Date | string;
      etablissement: {
        id: string;
        nom: string;
        email?: string;
        telephone?: string;
        adresse?: string;
        ville?: string;
      };
    };
  };
  demandeId: string;
}

export default function DocumentDetailPageClient({
  documentDetail,
  demandeId,
}: DocumentDetailPageClientProps) {
  const router = useRouter();
  const { status } = MESSAGES;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const studentName = `${documentDetail.nomBeneficiaire} ${documentDetail.prenomBeneficiaire}`;
  const hasSignedDocument = documentDetail.documentSigne?.pdfSigneUrl;
  
  // Nettoyer les URLs Cloudinary (corriger les problèmes d'URL)
  const cleanCloudinaryUrl = (url: string | undefined | null): string | undefined => {
    if (!url) return undefined;
    let cleanedUrl = url;
    
    // Convertir HTTP en HTTPS pour Cloudinary (évite les erreurs 401)
    if (cleanedUrl.startsWith('http://') && cleanedUrl.includes('cloudinary.com')) {
      cleanedUrl = cleanedUrl.replace('http://', 'https://');
    }
    
    // Corriger la double extension .pdf.pdf (problème connu avec Cloudinary raw files)
    if (cleanedUrl.endsWith('.pdf.pdf')) {
      cleanedUrl = cleanedUrl.replace(/\.pdf\.pdf$/, '.pdf');
    }
    
    return cleanedUrl;
  };
  
  const originalPdfUrl = cleanCloudinaryUrl(documentDetail.pdfOriginalUrl);
  const signedPdfUrl = hasSignedDocument
    ? cleanCloudinaryUrl(documentDetail.documentSigne!.pdfSigneUrl)
    : undefined;

  const isPending = documentDetail.status === null;
  const isApproved = documentDetail.status === "APPROUVE";
  const isRejected = documentDetail.status === "REJETE";

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

  const handleApprove = async () => {
    if (!isPending) return;

    try {
      setIsProcessing(true);
      await governmentService.bulkApproveDocuments(demandeId, {
        documentIds: [documentDetail.id],
      });
      // Rafraîchir la page
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      alert("Erreur lors de l'approbation. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;

    try {
      setIsProcessing(true);
      await governmentService.rejectDocument(demandeId, documentDetail.id, {
        raisonRejet: rejectReason,
        commentaire: rejectReason,
      });
      setShowRejectModal(false);
      setRejectReason("");
      // Rafraîchir la page
      router.refresh();
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      alert("Erreur lors du rejet. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] animate-in zoom-in duration-300">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={GOVERNMENT_ROUTES.CERTIFICATION_DETAIL(demandeId)}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-900 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à la demande
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Demande {documentDetail.demande.reference}
              </h3>
              <p className="text-xs text-slate-500">
                Soumis le {submissionDate} • Document{" "}
                {documentDetail.documentTypeNom}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isPending && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg shadow hover:shadow-md flex items-center gap-2 text-sm transition-all disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approuver
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isProcessing}
                  className="bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" /> Rejeter
                </button>
              </>
            )}
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
                <FileText className="w-5 h-5 text-emerald-900" />
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
                  {documentDetail.demande.etablissement.email && (
                    <p className="text-xs text-slate-500">
                      {documentDetail.demande.etablissement.email}
                    </p>
                  )}
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
                  <p className="font-medium text-emerald-900">
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
                    {documentDetail.documentTypePrix.toLocaleString("fr-FR")}{" "}
                    FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Statut</p>
                  <div className="mt-1">
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {status.approved}
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> {status.pending}
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Ban className="w-3 h-3" /> {status.rejected}
                      </span>
                    )}
                  </div>
                </div>
                {isRejected &&
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
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <PdfViewer
              originalPdfUrl={originalPdfUrl}
              signedPdfUrl={signedPdfUrl}
              fileName={`${documentDetail.documentTypeNom.replace(/\s+/g, "_")}_${
                documentDetail.id
              }.pdf`}
              emptyStateMessage="Document non disponible"
              emptyStateDescription={
                isPending
                  ? "Le document est en attente de traitement"
                  : isRejected
                  ? "Le document a été rejeté"
                  : "Aucun document disponible"
              }
            />
          </div>
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
                Rejeter le document
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Veuillez indiquer la raison du rejet de ce document.
            </p>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
              rows={3}
              placeholder="Raison du rejet..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                {MESSAGES.common.cancel}
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isProcessing}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Traitement..." : "Rejeter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

