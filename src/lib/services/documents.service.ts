/**
 * Service de gestion des types de documents
 * Gère les appels API liés aux types de documents autorisés
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types correspondant aux entités backend
export interface DocumentTypeEntity {
  id: string;
  nom: string;
  description?: string;
  prix: number;
}

export interface EtablissementParcoursEntity {
  id: string;
  etablissementId: string;
  parcoursId: string;
  createdAt: Date | string;
  parcours: {
    id: string;
    nom: string;
    duree: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
}

export class DocumentsService {
  /**
   * Récupérer les types de documents autorisés pour l'établissement
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Liste des types de documents autorisés
   */
  async getAuthorizedTypes(
    cookieHeader?: string
  ): Promise<DocumentTypeEntity[]> {
    return apiClient.get<DocumentTypeEntity[]>(
      API_ENDPOINTS.DOCUMENTS.GET_TYPES,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer les parcours associés à l'établissement
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Liste des parcours de l'établissement
   */
  async getEtablissementParcours(
    cookieHeader?: string
  ): Promise<EtablissementParcoursEntity[]> {
    return apiClient.get<EtablissementParcoursEntity[]>(
      API_ENDPOINTS.PROFILE.GET_PARCOURS,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer les parcours associés à un type de document (diplôme) pour l'établissement
   * @param documentTypeId - ID du type de document (diplôme)
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Liste des parcours associés au diplôme
   */
  async getParcoursByDocumentType(
    documentTypeId: string,
    cookieHeader?: string
  ): Promise<{ id: string; nom: string; duree: string }[]> {
    return apiClient.get<{ id: string; nom: string; duree: string }[]>(
      API_ENDPOINTS.PROFILE.GET_PARCOURS_BY_DOCUMENT_TYPE(documentTypeId),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }
}

// Export d'une instance singleton
export const documentsService = new DocumentsService();




