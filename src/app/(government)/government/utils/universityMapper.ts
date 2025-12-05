/**
 * Utilitaires pour mapper les données backend vers les types frontend pour les établissements
 */

import type { EtablissementEntity } from "@/lib/services/government.service";
import type { University, Filiere, UniversityStatus } from "../types";

/**
 * Convertit le type backend vers le type frontend
 */
function mapEtablissementType(
  type: "PRIVE" | "PUBLIC" | "UNIVERSITE" | "ECOLE_TECHNIQUE" | "LYCEE"
): "PUBLIC" | "PRIVE" {
  // Le backend a plus de types, mais le frontend n'a que PUBLIC/PRIVE
  // On considère UNIVERSITE, ECOLE_TECHNIQUE, LYCEE comme PUBLIC par défaut
  if (type === "PRIVE") return "PRIVE";
  return "PUBLIC";
}

/**
 * Convertit le statut (basé sur l'activité) vers le statut frontend
 * Pour l'instant, on considère tous les établissements comme ACTIVE
 * TODO: Ajouter un champ status dans le backend si nécessaire
 */
function mapEtablissementStatus(
  _etablissement: EtablissementEntity
): UniversityStatus {
  // Pour l'instant, on considère tous les établissements comme actifs
  // Si le backend ajoute un champ status, on pourra le mapper ici
  return "ACTIVE";
}

/**
 * Extrait la ville depuis l'adresse si disponible
 */
function extractCity(adresse: string | null | undefined): string {
  if (!adresse) return "Non spécifié";
  // Tenter d'extraire la ville (généralement à la fin de l'adresse)
  const parts = adresse.split(",");
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return adresse;
}

/**
 * Crée des filières à partir des types de documents autorisés
 */
function createFilieresFromDocumentTypes(
  etablissement: EtablissementEntity
): Filiere[] {
  if (!etablissement.documentsAutorises || etablissement.documentsAutorises.length === 0) {
    return [];
  }

  // Grouper les types de documents par catégorie/filière
  // Pour l'instant, on crée une filière par type de document
  // TODO: Améliorer cette logique si le backend fournit des informations sur les filières
  return etablissement.documentsAutorises.map((docAuth, index) => ({
    id: `fil-${etablissement.id}-${index}`,
    name: docAuth.documentType.nom,
    diplomas: [docAuth.documentType.nom],
  }));
}

/**
 * Mappe un établissement backend vers une University frontend
 */
export function mapEtablissementToUniversity(
  etablissement: EtablissementEntity
): University {
  // Compter le nombre de diplômes délivrés (basé sur les demandes traitées)
  const diplomaCount = etablissement._count?.demandes || 0;

  // Extraire la ville depuis l'adresse
  const city = extractCity(etablissement.adresse);

  // Créer les filières à partir des types de documents
  const filieres = createFilieresFromDocumentTypes(etablissement);

  // Déterminer le recteur (pour l'instant, on utilise le premier utilisateur ou un placeholder)
  // TODO: Ajouter un champ recteur dans le backend si nécessaire
  const rector = "Non spécifié";

  // Date de dernière activité (utiliser updatedAt)
  const lastActivity = etablissement.updatedAt
    ? new Date(etablissement.updatedAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    id: etablissement.id,
    name: etablissement.nom,
    type: mapEtablissementType(etablissement.type),
    rector,
    email: etablissement.email,
    city,
    status: mapEtablissementStatus(etablissement),
    diplomaCount,
    lastActivity,
    filieres,
    phone: etablissement.telephone,
    address: etablissement.adresse || undefined,
    description: undefined, // Pas disponible dans le backend actuellement
  };
}

/**
 * Mappe une liste d'établissements backend vers une liste d'Universités frontend
 */
export function mapEtablissementsToUniversities(
  etablissements: EtablissementEntity[]
): University[] {
  return etablissements.map(mapEtablissementToUniversity);
}


