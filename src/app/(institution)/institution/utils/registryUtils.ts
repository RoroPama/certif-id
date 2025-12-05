/**
 * Utilitaires pour transformer les données du registre
 */

import type { ApprovedDiploma } from "../types";
import type { DocumentSigneEntity } from "@/lib/services/registry.service";

/**
 * Transforme un DocumentSigneEntity du backend en ApprovedDiploma pour l'affichage
 * @param document - Document signé du backend
 * @returns Diplôme approuvé formaté pour l'affichage
 */
export function transformDocumentToDiploma(
  document: DocumentSigneEntity
): ApprovedDiploma {
  // Extraire les informations de la demande si disponibles
  const nomBeneficiaire = document.demande?.details?.nomBeneficiaire || "";
  const prenomBeneficiaire = document.demande?.details?.prenomBeneficiaire || "";
  const studentName = `${nomBeneficiaire} ${prenomBeneficiaire}`.trim() || "N/A";
  
  const documentTypeNom = document.demande?.details?.documentTypeNom || "Diplôme";
  
  // Formater la date d'émission
  const dateEmission = document.demande?.details?.dateEmission;
  let issueDate = "N/A";
  if (dateEmission) {
    const date = new Date(dateEmission);
    if (!isNaN(date.getTime())) {
      issueDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }

  // Générer un numéro de série basé sur le matricule, le QR code ou l'ID
  const date = new Date(document.createdAt);
  const year = date.getFullYear();
  let serialNumber: string;
  
  if (document.demande?.matricule) {
    // Utiliser le matricule si disponible
    serialNumber = document.demande.matricule;
  } else if (document.qrCodeData) {
    // Utiliser les données du QR code
    serialNumber = document.qrCodeData;
  } else {
    // Fallback: générer depuis l'ID et la date
    serialNumber = `UMNG-${year.toString().slice(-2)}-${document.id
      .substring(0, 8)
      .toUpperCase()}`;
  }

  // Extraire l'année académique (approximative basée sur la date de création)
  const academicYear = `${year - 1}-${year}`;

  // Le statut est toujours "active" pour les documents signés dans le registre
  // (les documents révoqués ne seraient normalement pas dans le registre)
  const status: "active" | "revoked" = "active";

  return {
    id: document.id,
    studentName,
    diplomaTitle: documentTypeNom,
    year: academicYear,
    issueDate,
    serialNumber,
    status,
    mention: "N/A", // Cette information n'est pas disponible dans DocumentSigneEntity
    filiere: "N/A", // Cette information n'est pas disponible dans DocumentSigneEntity
    pdfSigneUrl: document.pdfSigneUrl,
  };
}

/**
 * Transforme une liste de DocumentSigneEntity en liste d'ApprovedDiploma
 * @param documents - Liste de documents signés du backend
 * @returns Liste de diplômes approuvés formatés
 */
export function transformDocumentsToDiplomas(
  documents: DocumentSigneEntity[]
): ApprovedDiploma[] {
  return documents.map(transformDocumentToDiploma);
}

