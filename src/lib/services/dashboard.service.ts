/**
 * Service de gestion du dashboard établissement
 * Gère tous les appels API liés au tableau de bord
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types correspondant aux entités backend
export interface DashboardOverview {
  totalUsers: number;
  totalDemandes: number;
  demandesEnAttente: number;
  demandesApprouvees: number;
  demandesRejetees: number;
  documentsSignes: number;
  coutTotal: number;
}

export interface DashboardStats {
  parTypeDocument: Array<{
    documentType: string;
    count: number;
    montantTotal: number;
  }>;
  parStatut: Array<{
    statut: string;
    count: number;
  }>;
  evolutionMensuelle: Array<{
    mois: string;
    count: number;
  }>;
}

export interface DashboardReports {
  demandesRecentes: Array<{
    id: string;
    beneficiaire: string;
    documentType: string;
    statut: string;
    dateCreation: Date | string;
  }>;
  documentsRecents: Array<{
    id: string;
    beneficiaire: string;
    documentType: string;
    dateSignature: Date | string;
  }>;
}

export interface DashboardFilters {
  dateDebut?: string;
  dateFin?: string;
}

export class DashboardService {
  /**
   * Récupérer les statistiques globales (vue d'ensemble)
   * @param filters - Filtres optionnels (dates)
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Statistiques globales
   */
  async getOverview(
    filters?: DashboardFilters,
    cookieHeader?: string
  ): Promise<DashboardOverview> {
    return apiClient.get<DashboardOverview>(API_ENDPOINTS.DASHBOARD.OVERVIEW, {
      params: filters,
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
  }

  /**
   * Récupérer les statistiques détaillées
   * @param filters - Filtres optionnels (dates)
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Statistiques détaillées
   */
  async getStats(
    filters?: DashboardFilters,
    cookieHeader?: string
  ): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS, {
      params: filters,
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
  }

  /**
   * Récupérer les rapports (demandes récentes et documents récents)
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Rapports récents
   */
  async getReports(cookieHeader?: string): Promise<DashboardReports> {
    return apiClient.get<DashboardReports>(API_ENDPOINTS.DASHBOARD.REPORTS, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
  }
}

// Export d'une instance singleton
export const dashboardService = new DashboardService();

