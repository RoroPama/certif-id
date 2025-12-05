/**
 * Utilitaires pour enrichir les données de demande
 */

import type { DemandeEntity } from "@/lib/services/requests.service";
import type { SubmittedRequest } from "../types";

/**
 * Génère une référence depuis l'ID ou la date de création
 * Format: BORD-YYYY-XXX
 */
function generateReference(id: string, createdAt: Date | string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  // Utiliser les 6 derniers caractères de l'ID pour l'identifiant unique
  const shortId = id.slice(-6).toUpperCase();
  return `BORD-${year}-${shortId}`;
}

/**
 * Formate une date au format DD/MM/YYYY
 */
function formatSubmissionDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Calcule les compteurs depuis les documents
 */
function calculateCounters(documents: DemandeEntity["documents"]) {
  let approvedCount = 0;
  let rejectedCount = 0;
  let pendingCount = 0;

  documents.forEach((doc) => {
    if (doc.status === "APPROUVE") {
      approvedCount++;
    } else if (doc.status === "REJETE") {
      rejectedCount++;
    } else {
      pendingCount++;
    }
  });

  return {
    totalCount: documents.length,
    approvedCount,
    rejectedCount,
    pendingCount,
  };
}

/**
 * Enrichit une demande avec les champs calculés et formatés
 * @param demande - Demande brute du backend
 * @returns Demande enrichie avec reference, submissionDate, academicYear et compteurs
 */
export function enrichDemande(demande: DemandeEntity): SubmittedRequest {
  const counters = calculateCounters(demande.documents);

  return {
    ...demande,
    reference: generateReference(demande.id, demande.createdAt),
    submissionDate: formatSubmissionDate(demande.createdAt),
    academicYear: "2023-2024", // Valeur en dur temporaire
    ...counters,
  };
}

