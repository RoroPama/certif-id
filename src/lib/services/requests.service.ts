/**
 * Service de gestion des demandes
 * Gère tous les appels API liés aux demandes de signature
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types correspondant aux entités backend
export interface DemandeDocument {
  id: string;
  documentTypeId: string;
  status?: "APPROUVE" | "REJETE" | null;
  pdfOriginalUrl?: string;
  matricule?: string;
  nomBeneficiaire: string;
  prenomBeneficiaire: string;
  dateNaissance?: Date | string;
  lieuNaissance?: string;
  dateEmission: Date | string;
  emetteur: string;
  documentTypeNom: string;
  documentTypePrix: number;
  montantTotal: number;
  documentTypeDescription?: string;
  raisonRejet?: string | null;
  commentaireRejet?: string | null;
  documentSigne?: {
    id: string;
    pdfSigneUrl: string;
    qrCodeData: string;
    signataireId: string;
    createdAt: Date | string;
  };
  documentType: {
    id: string;
    nom: string;
    description?: string;
    prix: number;
  };
}

export interface DemandeEntity {
  id: string;
  etablissementId: string;
  statut: string;
  note?: string;
  documents: DemandeDocument[];
  etablissement: {
    id: string;
    nom: string;
    type: string;
    email: string;
    telephone: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaginatedDemandesEntity {
  data: DemandeEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DemandeFilters {
  search?: string;
  statut?: "EN_ATTENTE" | "APPROUVE" | "REJETE";
  documentTypeId?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  limit?: number;
}

export interface CreateDemandeDto {
  documentTypeId: string;
  nomBeneficiaire: string;
  prenomBeneficiaire: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  dateEmission: string;
  pdfOriginalUrl: string;
  note?: string;
  matricule?: string;
}

export interface DocumentDetail {
  id: string;
  demandeId: string;
  documentTypeId: string;
  status?: "APPROUVE" | "REJETE" | null;
  pdfOriginalUrl?: string;
  matricule?: string;
  nomBeneficiaire: string;
  prenomBeneficiaire: string;
  dateNaissance?: Date | string;
  lieuNaissance?: string;
  dateEmission: Date | string;
  emetteur: string;
  documentTypeNom: string;
  documentTypePrix: number;
  montantTotal: number;
  documentTypeDescription?: string;
  raisonRejet?: string | null;
  commentaireRejet?: string | null;
  documentSigne?: {
    id: string;
    pdfSigneUrl: string;
    qrCodeData: string;
    signataireId: string;
    createdAt: Date | string;
  };
  documentType: {
    id: string;
    nom: string;
    description?: string;
    prix: number;
  };
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
      type: string;
      email: string;
      telephone: string;
    };
  };
}

export class RequestsService {
  /**
   * Récupérer toutes les demandes avec filtres optionnels
   * @param filters - Filtres de recherche et pagination
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Liste paginée des demandes
   */
  async getAllRequests(
    filters?: DemandeFilters,
    cookieHeader?: string
  ): Promise<PaginatedDemandesEntity> {
    return apiClient.get<PaginatedDemandesEntity>(
      API_ENDPOINTS.REQUESTS.GET_ALL,
      {
        params: filters,
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer une demande spécifique par son ID
   * @param id - ID de la demande
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Détails de la demande
   */
  async getRequestById(
    id: string,
    cookieHeader?: string
  ): Promise<DemandeEntity> {
    return apiClient.get<DemandeEntity>(API_ENDPOINTS.REQUESTS.GET_BY_ID(id), {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
  }

  /**
   * Récupérer les détails complets d'un document spécifique
   * @param demandeId - ID de la demande
   * @param documentId - ID du document
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Détails complets du document
   */
  async getDocumentById(
    demandeId: string,
    documentId: string,
    cookieHeader?: string
  ): Promise<DocumentDetail> {
    return apiClient.get<DocumentDetail>(
      API_ENDPOINTS.REQUESTS.GET_DOCUMENT_BY_ID(demandeId, documentId),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Créer une nouvelle demande de signature
   * @param createDemandeDto - Données de la demande à créer
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Demande créée
   */
  async createRequest(
    createDemandeDto: CreateDemandeDto,
    cookieHeader?: string
  ): Promise<DemandeEntity> {
    return apiClient.post<DemandeEntity>(
      API_ENDPOINTS.REQUESTS.CREATE,
      createDemandeDto,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }
}

// Export d'une instance singleton
export const requestsService = new RequestsService();
