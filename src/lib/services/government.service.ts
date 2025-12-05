/**
 * Service de gestion des demandes pour le module gouvernement (ministère)
 * Gère tous les appels API liés aux demandes de certification
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { DemandeEntity, DemandeDocument } from "./requests.service";

// Types pour les filtres
export interface DemandeFilters {
  statut?: "EN_ATTENTE" | "TRAITEE" | "REJETEE";
  etablissementId?: string;
  documentTypeId?: string;
  limit?: number;
  offset?: number;
}

// Type pour la réponse paginée
export interface PaginatedDemandesResponse {
  demandes: DemandeEntity[];
  total: number;
}

// Type pour les statistiques
export interface DemandeStats {
  total: number;
  enAttente: number;
  approuvees: number;
  rejetee: number;
  signee: number;
}

// DTOs pour les actions
export interface BulkApproveDocumentsDto {
  documentIds?: string[];
}

export interface BulkRejectDocumentsDto {
  raisonRejet: string;
  commentaire?: string;
  documentIds?: string[];
}

export interface RejectDocumentDto {
  raisonRejet: string;
  commentaire?: string;
}

export interface SignDocumentDto {
  pdfSigneUrl: string;
  qrCodeData: string;
}

export class GovernmentService {
  /**
   * Récupérer toutes les demandes avec filtres et pagination
   */
  async getAllDemandes(
    filters?: DemandeFilters,
    cookieHeader?: string
  ): Promise<PaginatedDemandesResponse> {
    return apiClient.get<PaginatedDemandesResponse>(
      API_ENDPOINTS.MINISTERE.DEMANDES.GET_ALL,
      {
        params: filters,
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer une demande spécifique par son ID
   */
  async getDemandeById(
    id: string,
    cookieHeader?: string
  ): Promise<DemandeEntity> {
    return apiClient.get<DemandeEntity>(
      API_ENDPOINTS.MINISTERE.DEMANDES.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer les détails d'un document spécifique
   */
  async getDocumentById(
    demandeId: string,
    documentId: string,
    cookieHeader?: string
  ): Promise<
    DemandeDocument & {
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
    }
  > {
    const endpoint = API_ENDPOINTS.MINISTERE.DEMANDES.GET_DOCUMENT_BY_ID(
      demandeId,
      documentId
    );

    // Log pour debug - toujours actif pour voir ce qui se passe
    console.log(`[GovernmentService] getDocumentById appelé avec:`, {
      demandeId,
      documentId,
    });
    console.log(`[GovernmentService] Endpoint généré: ${endpoint}`);
    console.log(
      `[GovernmentService] Endpoint complet: ${
        apiClient["client"]?.defaults?.baseURL || "N/A"
      }${endpoint}`
    );

    // Vérifier que l'endpoint est correct
    if (!endpoint.includes("/demandes/") || !endpoint.includes("/documents/")) {
      console.error(
        `[GovernmentService] ERREUR: Endpoint mal formé: ${endpoint}`
      );
      throw new Error(
        `Endpoint mal formé: ${endpoint}. Attendu: /ministere/demandes/:demandeId/documents/:documentId`
      );
    }

    return apiClient
      .get<
        DemandeDocument & {
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
        }
      >(endpoint, {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      })
      .catch((error) => {
        // Log pour debug
        console.error(
          `[GovernmentService] Erreur lors de l'appel à ${endpoint}:`,
          error
        );
        console.error(`[GovernmentService] Endpoint utilisé: ${endpoint}`);
        throw error;
      });
  }

  /**
   * Récupérer les statistiques des demandes
   */
  async getDemandesStats(cookieHeader?: string): Promise<DemandeStats> {
    return apiClient.get<DemandeStats>(
      API_ENDPOINTS.MINISTERE.DEMANDES.GET_STATS,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Approuver en masse plusieurs documents d'une demande
   */
  async bulkApproveDocuments(
    demandeId: string,
    data: BulkApproveDocumentsDto,
    cookieHeader?: string
  ): Promise<DemandeEntity> {
    return apiClient.post<DemandeEntity>(
      API_ENDPOINTS.MINISTERE.DEMANDES.BULK_APPROVE(demandeId),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Rejeter en masse plusieurs documents d'une demande
   */
  async bulkRejectDocuments(
    demandeId: string,
    data: BulkRejectDocumentsDto,
    cookieHeader?: string
  ): Promise<DemandeEntity> {
    return apiClient.post<DemandeEntity>(
      API_ENDPOINTS.MINISTERE.DEMANDES.BULK_REJECT(demandeId),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Approuver et signer un document spécifique
   * Note: Pour l'instant, on utilise l'endpoint sign qui nécessite pdfSigneUrl et qrCodeData
   * TODO: Créer un endpoint approve qui génère automatiquement le PDF signé
   */
  async approveDocument(
    demandeId: string,
    documentId: string,
    data: SignDocumentDto,
    cookieHeader?: string
  ): Promise<DemandeDocument> {
    return apiClient.post<DemandeDocument>(
      API_ENDPOINTS.MINISTERE.DEMANDES.APPROVE_DOCUMENT(demandeId, documentId),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Rejeter un document spécifique
   */
  async rejectDocument(
    demandeId: string,
    documentId: string,
    data: RejectDocumentDto,
    cookieHeader?: string
  ): Promise<DemandeDocument> {
    return apiClient.patch<DemandeDocument>(
      API_ENDPOINTS.MINISTERE.DEMANDES.REJECT_DOCUMENT(demandeId, documentId),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer tous les documents signés (registre)
   */
  async getAllDocuments(cookieHeader?: string): Promise<DocumentSigneEntity[]> {
    return apiClient.get<DocumentSigneEntity[]>(
      API_ENDPOINTS.MINISTERE.DOCUMENTS.GET_ALL,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer un document signé spécifique par son ID (du registre)
   */
  async getSignedDocumentById(
    id: string,
    cookieHeader?: string
  ): Promise<DocumentSigneEntity> {
    return apiClient.get<DocumentSigneEntity>(
      API_ENDPOINTS.MINISTERE.DOCUMENTS.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer tous les établissements
   */
  async getAllEtablissements(
    cookieHeader?: string
  ): Promise<EtablissementEntity[]> {
    return apiClient.get<EtablissementEntity[]>(
      API_ENDPOINTS.MINISTERE.ETABLISSEMENTS.GET_ALL,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer un établissement par son ID
   */
  async getEtablissementById(
    id: string,
    cookieHeader?: string
  ): Promise<EtablissementEntity> {
    return apiClient.get<EtablissementEntity>(
      API_ENDPOINTS.MINISTERE.ETABLISSEMENTS.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Créer un nouvel établissement
   */
  async createEtablissement(
    data: CreateEtablissementDto,
    cookieHeader?: string
  ): Promise<EtablissementEntity> {
    return apiClient.post<EtablissementEntity>(
      API_ENDPOINTS.MINISTERE.ETABLISSEMENTS.CREATE,
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Mettre à jour un établissement
   */
  async updateEtablissement(
    id: string,
    data: UpdateEtablissementDto,
    cookieHeader?: string
  ): Promise<EtablissementEntity> {
    return apiClient.put<EtablissementEntity>(
      API_ENDPOINTS.MINISTERE.ETABLISSEMENTS.UPDATE(id),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }
}

// Type pour les documents signés du ministère
export interface DocumentSigneEntity {
  id: string;
  demandeId: string;
  signataireId: string;
  pdfSigneUrl: string;
  qrCodeData: string;
  demandeDetails?: {
    id: string;
    matricule: string | null;
    nomBeneficiaire: string;
    prenomBeneficiaire: string;
    documentTypeNom: string;
    dateEmission: Date | string;
    emetteur: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Type pour les établissements
export interface EtablissementEntity {
  id: string;
  nom: string;
  numeroDecret: string;
  type: "PRIVE" | "PUBLIC" | "UNIVERSITE" | "ECOLE_TECHNIQUE" | "LYCEE";
  adresse: string | null;
  telephone: string;
  email: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    users: number;
    demandes: number;
    documentsAutorises: number;
  };
  documentsAutorises?: {
    id: string;
    etablissementId: string;
    documentTypeId: string;
    createdAt: Date | string;
    documentType: {
      id: string;
      nom: string;
      description: string | null;
      prix: number;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }[];
}

// DTOs pour les établissements
export interface CreateEtablissementDto {
  nom: string;
  numeroDecret: string;
  type: "PRIVE" | "PUBLIC" | "UNIVERSITE" | "ECOLE_TECHNIQUE" | "LYCEE";
  adresse?: string;
  telephone: string;
  email: string;
  documentTypeNames: string[];
}

export interface UpdateEtablissementDto {
  nom?: string;
  numeroDecret?: string;
  type?: "PRIVE" | "PUBLIC" | "UNIVERSITE" | "ECOLE_TECHNIQUE" | "LYCEE";
  adresse?: string;
  telephone?: string;
  email?: string;
  documentTypeNames?: string[];
}

// Export d'une instance singleton
export const governmentService = new GovernmentService();
