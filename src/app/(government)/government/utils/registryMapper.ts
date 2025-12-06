/**
 * Utilitaires pour mapper les documents signés backend vers les types frontend du registre
 */

import type { DocumentSigneEntity } from "@/lib/services/government.service";
import type { RegistryEntry, RegistryEntryStatus } from "../types";

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
 * Extrait l'année depuis une date
 */
function extractYear(date: Date | string): string {
  return new Date(date).getFullYear().toString();
}

/**
 * Génère un numéro de série depuis l'ID du document
 */
function generateSerialNumber(id: string, createdAt: Date | string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const shortId = id.slice(-5).toUpperCase();
  return `CG-${year}-${shortId.padStart(5, "0")}`;
}

/**
 * Extrait le nom de l'université depuis l'emetteur
 * L'emetteur contient généralement le nom de l'établissement
 */
function extractUniversityName(emetteur: string): string {
  return emetteur || "Établissement inconnu";
}

/**
 * Extrait le parcours depuis les données du document
 */
function extractParcours(document: DocumentSigneEntity): string {
  // Utiliser le parcours depuis les données backend si disponible
  if (document.parcours?.nom) {
    return document.parcours.nom;
  }
  // Fallback : utiliser le type de document si le parcours n'est pas disponible
  return document.demandeDetails?.documentTypeNom || "Non spécifié";
}

/**
 * Extrait la mention depuis les données du document
 * Pour l'instant, on retourne "N/A" car la mention n'est pas disponible dans le backend
 * TODO: Ajouter la mention dans le backend si nécessaire
 */
function extractMention(): string {
  return "N/A";
}

/**
 * Extrait la promotion depuis la date d'émission
 */
function extractPromotion(dateEmission: Date | string): string {
  return new Date(dateEmission).getFullYear().toString();
}

/**
 * Détermine le statut du document
 * Pour l'instant, tous les documents signés sont considérés comme valides
 * TODO: Ajouter un champ de statut dans le backend si nécessaire
 */
function determineStatus(): RegistryEntryStatus {
  return "VALIDE";
}

/**
 * Mappe un document signé backend vers une entrée de registre frontend
 */
export function mapDocumentToRegistryEntry(
  document: DocumentSigneEntity
): RegistryEntry {
  const demandeDetails = document.demandeDetails;
  
  if (!demandeDetails) {
    throw new Error("Les détails de la demande sont manquants");
  }

  const studentName = `${demandeDetails.prenomBeneficiaire} ${demandeDetails.nomBeneficiaire}`.trim();
  const universityName = extractUniversityName(demandeDetails.emetteur);
  const parcours = extractParcours(document);
  const promotion = extractPromotion(demandeDetails.dateEmission);
  const year = extractYear(demandeDetails.dateEmission);
  const issueDate = formatDate(demandeDetails.dateEmission);
  const serialNumber = generateSerialNumber(document.id, document.createdAt);

  return {
    id: document.id,
    serialNumber,
    studentName,
    universityName,
    diplomaTitle: demandeDetails.documentTypeNom,
    parcours,
    mention: extractMention(),
    promotion,
    issueDate,
    year,
    status: determineStatus(),
  };
}

/**
 * Mappe une liste de documents signés vers une liste d'entrées de registre
 */
export function mapDocumentsToRegistryEntries(
  documents: DocumentSigneEntity[]
): RegistryEntry[] {
  return documents.map(mapDocumentToRegistryEntry);
}

