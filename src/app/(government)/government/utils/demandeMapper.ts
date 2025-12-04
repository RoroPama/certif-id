/**
 * Utilitaires pour mapper les données backend vers les types frontend
 */

import type {
  DemandeEntity,
  DemandeDocument,
} from "@/lib/services/requests.service";
import type {
  CertificationRequest,
  StudentItem,
  CertificationRequestStatus,
} from "../types";

/**
 * Convertit le statut backend vers le statut frontend
 */
function mapDemandeStatus(statut: string): CertificationRequestStatus {
  switch (statut) {
    case "EN_ATTENTE":
      return "PENDING";
    case "TRAITEE":
      return "COMPLETED";
    case "REJETEE":
      return "COMPLETED"; // Si tous les documents sont rejetés, c'est complété
    default:
      return "PENDING";
  }
}

/**
 * Convertit le statut d'un document backend vers le statut frontend
 */
function mapDocumentStatus(
  status: "APPROUVE" | "REJETE" | null
): "PENDING" | "APPROVED" | "REJECTED" {
  if (status === "APPROUVE") return "APPROVED";
  if (status === "REJETE") return "REJECTED";
  return "PENDING";
}

/**
 * Génère une référence depuis l'ID ou la date de création
 */
function generateReference(id: string, createdAt: Date | string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const shortId = id.slice(-6).toUpperCase();
  return `CERT-${year}-${month}${day}-${shortId}`;
}

/**
 * Formate une date au format DD/MM/YYYY
 */
function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Mappe un document backend vers un StudentItem frontend
 */
function mapDocumentToStudentItem(
  document: DemandeDocument,
  promotion?: string
): StudentItem {
  return {
    id: document.id,
    firstName: document.prenomBeneficiaire,
    lastName: document.nomBeneficiaire,
    diplomaTitle: document.documentTypeNom,
    mention: "N/A", // Pas disponible dans le backend actuellement
    promotion:
      promotion || new Date(document.dateEmission).getFullYear().toString(),
    status: mapDocumentStatus(document.status),
    rejectionReason:
      document.raisonRejet || document.commentaireRejet || undefined,
    birthDate: document.dateNaissance
      ? formatDate(document.dateNaissance)
      : undefined,
    matricule: document.matricule,
  };
}

/**
 * Mappe une demande backend vers une CertificationRequest frontend
 */
export function mapDemandeToCertificationRequest(
  demande: DemandeEntity
): CertificationRequest {
  const documents = demande.documents || [];
  const items: StudentItem[] = documents.map((doc) =>
    mapDocumentToStudentItem(doc)
  );

  // Calculer les compteurs
  const approvedCount = documents.filter((d) => d.status === "APPROUVE").length;
  const rejectedCount = documents.filter((d) => d.status === "REJETE").length;
  const pendingCount = documents.filter((d) => d.status === null).length;
  const processedCount = approvedCount + rejectedCount;

  // Déterminer le statut
  let status: CertificationRequestStatus = "PENDING";
  if (pendingCount === 0 && approvedCount > 0) {
    status = "COMPLETED";
  } else if (pendingCount === 0 && rejectedCount === documents.length) {
    status = "COMPLETED"; // Tous rejetés = complété
  } else if (processedCount > 0) {
    status = "PARTIAL";
  }

  return {
    id: demande.id,
    reference: generateReference(demande.id, demande.createdAt),
    universityId: demande.etablissementId,
    universityName: demande.etablissement.nom,
    submissionDate: formatDate(demande.createdAt),
    totalStudents: documents.length,
    processedCount,
    status,
    items,
  };
}
