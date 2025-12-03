/**
 * Service de gestion de la configuration académique
 * Récupère les informations de configuration depuis le backend
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types pour la configuration académique
export interface AcademicConfig {
  filieres: {
    id: string;
    name: string;
    diplomas: {
      id: string;
      name: string;
    }[];
  }[];
  foundationYear: number;
}

// Type pour le profil de l'établissement
export interface EtablissementProfile {
  id: string;
  nom: string;
  numeroDecret: string;
  type: string;
  adresse?: string;
  telephone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class ConfigService {
  /**
   * Récupérer le profil de l'établissement
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Profil de l'établissement
   */
  async getProfile(
    cookieHeader?: string
  ): Promise<EtablissementProfile> {
    return apiClient.get<EtablissementProfile>(
      API_ENDPOINTS.PROFILE.GET,
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer la configuration académique
   * Pour l'instant, on récupère le profil et on construit une configuration par défaut
   * TODO: Créer un endpoint backend dédié pour la configuration académique
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Configuration académique
   */
  async getAcademicConfig(
    cookieHeader?: string
  ): Promise<AcademicConfig> {
    // Pour l'instant, on retourne une configuration vide
    // TODO: Implémenter l'endpoint backend pour récupérer les filières et diplômes
    // L'endpoint pourrait être: GET /etablissement/config ou GET /ministere/etablissements/:id/config
    return {
      filieres: [],
      foundationYear: new Date().getFullYear() - 10, // Par défaut, 10 ans en arrière
    };
  }
}

// Export d'une instance singleton
export const configService = new ConfigService();

