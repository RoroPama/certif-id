/**
 * Service de gestion du registre des documents signés
 * Gère tous les appels API liés aux documents signés (diplômes/certificats)
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types correspondant aux entités backend
export interface DocumentSigneEntity {
  id: string;
  demandeId: string;
  pdfSigneUrl: string;
  qrCodeData: string;
  demande?: {
    id: string;
    matricule: string | null;
    details: {
      nomBeneficiaire: string;
      prenomBeneficiaire: string;
      documentTypeNom: string;
      dateEmission: Date | string;
    };
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaginatedDocumentsEntity {
  data: DocumentSigneEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentFilters {
  search?: string;
  documentTypeId?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  limit?: number;
}

export interface DownloadResponse {
  url: string;
  filename: string;
}

export class RegistryService {
  /**
   * Récupérer tous les documents signés sans pagination
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Liste complète des documents signés
   */
  async getAllDocuments(
    cookieHeader?: string
  ): Promise<DocumentSigneEntity[]> {
    return apiClient.get<DocumentSigneEntity[]>(
      API_ENDPOINTS.REGISTRY.GET_ALL,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer l'historique des documents signés avec pagination et filtres
   * @param filters - Filtres de recherche et pagination
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Liste paginée des documents signés
   */
  async getHistory(
    filters?: DocumentFilters,
    cookieHeader?: string
  ): Promise<PaginatedDocumentsEntity> {
    return apiClient.get<PaginatedDocumentsEntity>(
      API_ENDPOINTS.REGISTRY.GET_HISTORY,
      {
        params: filters,
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer un document signé spécifique par son ID
   * @param id - ID du document signé
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Détails du document signé
   */
  async getDocumentById(
    id: string,
    cookieHeader?: string
  ): Promise<DocumentSigneEntity> {
    return apiClient.get<DocumentSigneEntity>(
      API_ENDPOINTS.REGISTRY.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer l'URL de téléchargement d'un document signé
   * @param id - ID du document signé
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns URL de téléchargement et nom de fichier
   */
  async download(
    id: string,
    cookieHeader?: string
  ): Promise<DownloadResponse> {
    return apiClient.get<DownloadResponse>(
      API_ENDPOINTS.REGISTRY.DOWNLOAD(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }
}

// Export d'une instance singleton
export const registryService = new RegistryService();

