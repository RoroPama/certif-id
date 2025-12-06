/**
 * Service de gestion de la configuration pour le module gouvernement
 * Gère les parcours, diplômes et autres paramètres de configuration
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types pour les parcours
export interface ParcoursEntity {
  id: string;
  nom: string;
  duree: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Enum pour les niveaux d'éducation
export enum NiveauEducation {
  SECONDAIRE = 'SECONDAIRE',
  UNIVERSITE = 'UNIVERSITE',
}

// Types pour les types de documents (diplômes)
export interface DocumentTypeEntity {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  niveau: NiveauEducation;
  serie: string | null;
  parcours?: {
    id: string;
    nom: string;
    duree: string;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Type pour le profil de l'établissement
export interface EtablissementProfile {
  id: string;
  nom: string;
  numeroDecret: string;
  type: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  parcours?: {
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
  }[];
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

// DTO pour la mise à jour du profil
export interface UpdateProfileDto {
  nom?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

// DTOs pour la création
export interface CreateParcoursDto {
  nom: string;
  duree: string;
}

export interface UpdateParcoursDto {
  nom?: string;
  duree?: string;
}

export interface CreateDocumentTypeDto {
  nom: string;
  description?: string;
  prix: number;
  niveau: NiveauEducation;
  serie?: string;
  parcoursIds?: string[];
}

export interface UpdateDocumentTypeDto {
  nom?: string;
  description?: string;
  prix?: number;
  niveau?: NiveauEducation;
  serie?: string;
  parcoursIds?: string[];
}

export class ConfigService {
  /**
   * Récupérer tous les parcours
   */
  async getAllParcours(cookieHeader?: string): Promise<ParcoursEntity[]> {
    try {
      return await apiClient.get<ParcoursEntity[]>(
        API_ENDPOINTS.MINISTERE.PARCOURS.GET_ALL,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        }
      );
    } catch (error: unknown) {
      console.error("[ConfigService] Erreur getAllParcours:", error);
      throw error;
    }
  }

  /**
   * Récupérer un parcours par son ID
   */
  async getParcoursById(
    id: string,
    cookieHeader?: string
  ): Promise<ParcoursEntity> {
    return apiClient.get<ParcoursEntity>(
      API_ENDPOINTS.MINISTERE.PARCOURS.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Créer un nouveau parcours
   */
  async createParcours(
    data: CreateParcoursDto,
    cookieHeader?: string
  ): Promise<ParcoursEntity> {
    return apiClient.post<ParcoursEntity>(
      API_ENDPOINTS.MINISTERE.PARCOURS.CREATE,
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Mettre à jour un parcours
   */
  async updateParcours(
    id: string,
    data: UpdateParcoursDto,
    cookieHeader?: string
  ): Promise<ParcoursEntity> {
    return apiClient.put<ParcoursEntity>(
      API_ENDPOINTS.MINISTERE.PARCOURS.UPDATE(id),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Supprimer un parcours
   */
  async deleteParcours(id: string, cookieHeader?: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.MINISTERE.PARCOURS.DELETE(id), {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
  }

  /**
   * Récupérer tous les types de documents (diplômes)
   */
  async getAllDocumentTypes(
    cookieHeader?: string
  ): Promise<DocumentTypeEntity[]> {
    try {
      return await apiClient.get<DocumentTypeEntity[]>(
        API_ENDPOINTS.MINISTERE.DOCUMENT_TYPES.GET_ALL,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        }
      );
    } catch (error: unknown) {
      console.error("[ConfigService] Erreur getAllDocumentTypes:", error);
      throw error;
    }
  }

  /**
   * Récupérer un type de document par son ID
   */
  async getDocumentTypeById(
    id: string,
    cookieHeader?: string
  ): Promise<DocumentTypeEntity> {
    return apiClient.get<DocumentTypeEntity>(
      API_ENDPOINTS.MINISTERE.DOCUMENT_TYPES.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Créer un nouveau type de document
   */
  async createDocumentType(
    data: CreateDocumentTypeDto,
    cookieHeader?: string
  ): Promise<DocumentTypeEntity> {
    return apiClient.post<DocumentTypeEntity>(
      API_ENDPOINTS.MINISTERE.DOCUMENT_TYPES.CREATE,
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Mettre à jour un type de document
   */
  async updateDocumentType(
    id: string,
    data: UpdateDocumentTypeDto,
    cookieHeader?: string
  ): Promise<DocumentTypeEntity> {
    return apiClient.patch<DocumentTypeEntity>(
      API_ENDPOINTS.MINISTERE.DOCUMENT_TYPES.UPDATE(id),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Supprimer un type de document
   */
  async deleteDocumentType(id: string, cookieHeader?: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.MINISTERE.DOCUMENT_TYPES.DELETE(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer le profil de l'établissement
   */
  async getProfile(cookieHeader?: string): Promise<EtablissementProfile> {
    try {
      return await apiClient.get<EtablissementProfile>(
        API_ENDPOINTS.PROFILE.GET,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        }
      );
    } catch (error: unknown) {
      console.error("[ConfigService] Erreur getProfile:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil de l'établissement
   */
  async updateProfile(
    data: UpdateProfileDto,
    cookieHeader?: string
  ): Promise<EtablissementProfile> {
    try {
      return await apiClient.put<EtablissementProfile>(
        API_ENDPOINTS.PROFILE.UPDATE,
        data,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        }
      );
    } catch (error: unknown) {
      console.error("[ConfigService] Erreur updateProfile:", error);
      throw error;
    }
  }
}

// Export d'une instance singleton
export const configService = new ConfigService();
