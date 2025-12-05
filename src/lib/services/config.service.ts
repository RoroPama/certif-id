/**
 * Service de gestion de la configuration pour le module gouvernement
 * Gère les filières, diplômes et autres paramètres de configuration
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types pour les filières
export interface FiliereEntity {
  id: string;
  nom: string;
  description: string | null;
  code: string | null;
  actif: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  documentTypes?: DocumentTypeEntity[];
  _count?: {
    documentTypes: number;
  };
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
  filieres?: {
    id: string;
    nom: string;
    code: string | null;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// DTOs pour la création
export interface CreateFiliereDto {
  nom: string;
  description?: string;
  code?: string;
  actif?: boolean;
}

export interface UpdateFiliereDto {
  nom?: string;
  description?: string;
  code?: string;
  actif?: boolean;
}

export interface CreateDocumentTypeDto {
  nom: string;
  description?: string;
  prix: number;
  niveau: NiveauEducation;
  serie?: string;
  filiereIds?: string[];
}

export interface UpdateDocumentTypeDto {
  nom?: string;
  description?: string;
  prix?: number;
  niveau?: NiveauEducation;
  serie?: string;
  filiereIds?: string[];
}

export class ConfigService {
  /**
   * Récupérer toutes les filières
   */
  async getAllFilieres(cookieHeader?: string): Promise<FiliereEntity[]> {
    try {
      return await apiClient.get<FiliereEntity[]>(
        API_ENDPOINTS.MINISTERE.FILIERES.GET_ALL,
        {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        }
      );
    } catch (error: any) {
      console.error("[ConfigService] Erreur getAllFilieres:", error);
      throw error;
    }
  }

  /**
   * Récupérer une filière par son ID
   */
  async getFiliereById(
    id: string,
    cookieHeader?: string
  ): Promise<FiliereEntity> {
    return apiClient.get<FiliereEntity>(
      API_ENDPOINTS.MINISTERE.FILIERES.GET_BY_ID(id),
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Créer une nouvelle filière
   */
  async createFiliere(
    data: CreateFiliereDto,
    cookieHeader?: string
  ): Promise<FiliereEntity> {
    return apiClient.post<FiliereEntity>(
      API_ENDPOINTS.MINISTERE.FILIERES.CREATE,
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Mettre à jour une filière
   */
  async updateFiliere(
    id: string,
    data: UpdateFiliereDto,
    cookieHeader?: string
  ): Promise<FiliereEntity> {
    return apiClient.put<FiliereEntity>(
      API_ENDPOINTS.MINISTERE.FILIERES.UPDATE(id),
      data,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Supprimer une filière
   */
  async deleteFiliere(id: string, cookieHeader?: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.MINISTERE.FILIERES.DELETE(id), {
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
    } catch (error: any) {
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
    return apiClient.put<DocumentTypeEntity>(
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
}

// Export d'une instance singleton
export const configService = new ConfigService();
