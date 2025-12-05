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
}

// Export d'une instance singleton
export const documentsService = new DocumentsService();




