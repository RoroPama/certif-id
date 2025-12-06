/**
 * Service de gestion du dashboard ministère
 * Gère tous les appels API liés au tableau de bord gouvernement
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Types correspondant aux entités backend
export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  etablissementId?: string;
  documentTypeId?: string;
}

export interface DashboardStats {
  demandes: {
    total: number;
    enAttente: number;
    approuvees: number;
    rejetee: number;
    signee: number;
  };
  chiffreAffaires: {
    total: number;
    periode: string;
    detailsParType: Array<{
      documentType: string;
      nombreDocuments: number;
      montantTotal: number;
    }>;
  };
  etablissements: {
    total: number;
    actifs: number;
    totalDemandes: number;
    montantTotalDu: number;
  };
  evolution: Array<{
    periode: string;
    demandesSignees: number;
    chiffreAffaires: number;
  }>;
}

export interface PeriodStats {
  periode: string;
  demandesSignees: number;
  chiffreAffaires: number;
  nombreEtablissements: number;
}

export interface TopEtablissement {
  etablissement: {
    id: string;
    nom: string;
    type: string;
  };
  demandesSignees: number;
  chiffreAffaires: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  period: string;
  byDocumentType: Array<{
    documentType: string;
    count: number;
    revenue: number;
  }>;
}

export class GovernmentDashboardService {
  /**
   * Récupérer les statistiques générales du dashboard
   * @param filters - Filtres optionnels (dates, établissement, type de document)
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Statistiques générales
   */
  async getStats(
    filters?: DashboardFilters,
    cookieHeader?: string
  ): Promise<DashboardStats> {
    // Nettoyer les filtres pour ne pas envoyer de valeurs vides ou undefined
    const cleanFilters: Record<string, string> = {};
    if (filters?.startDate && typeof filters.startDate === "string" && filters.startDate.trim() !== "")
      cleanFilters.startDate = filters.startDate.trim();
    if (filters?.endDate && typeof filters.endDate === "string" && filters.endDate.trim() !== "")
      cleanFilters.endDate = filters.endDate.trim();
    if (filters?.etablissementId && typeof filters.etablissementId === "string" && filters.etablissementId.trim() !== "")
      cleanFilters.etablissementId = filters.etablissementId.trim();
    if (filters?.documentTypeId && typeof filters.documentTypeId === "string" && filters.documentTypeId.trim() !== "")
      cleanFilters.documentTypeId = filters.documentTypeId.trim();

    return apiClient.get<DashboardStats>(
      API_ENDPOINTS.DASHBOARD_MINISTERE.STATS,
      {
        params: Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined,
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer les statistiques par période
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @param groupBy - Type de groupement (day, week, month)
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Statistiques par période
   */
  async getStatsByPeriod(
    startDate: string,
    endDate: string,
    groupBy: "day" | "week" | "month" = "month",
    cookieHeader?: string
  ): Promise<PeriodStats[]> {
    // Valider que les dates sont présentes et non vides
    if (!startDate || !endDate) {
      throw new Error("startDate et endDate sont requis");
    }

    return apiClient.get<PeriodStats[]>(
      API_ENDPOINTS.DASHBOARD_MINISTERE.STATS_BY_PERIOD,
      {
        params: { startDate, endDate, groupBy },
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer le top des établissements
   * @param limit - Nombre maximum de résultats
   * @param filters - Filtres optionnels
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Top établissements
   */
  async getTopEtablissements(
    limit: number = 10,
    filters?: DashboardFilters,
    cookieHeader?: string
  ): Promise<TopEtablissement[]> {
    // Nettoyer les filtres pour ne pas envoyer de valeurs vides ou undefined
    const cleanFilters: Record<string, string | number> = { limit };
    if (filters?.startDate && filters.startDate.trim() !== "")
      cleanFilters.startDate = filters.startDate.trim();
    if (filters?.endDate && filters.endDate.trim() !== "")
      cleanFilters.endDate = filters.endDate.trim();
    if (filters?.etablissementId && filters.etablissementId.trim() !== "")
      cleanFilters.etablissementId = filters.etablissementId.trim();
    if (filters?.documentTypeId && filters.documentTypeId.trim() !== "")
      cleanFilters.documentTypeId = filters.documentTypeId.trim();

    return apiClient.get<TopEtablissement[]>(
      API_ENDPOINTS.DASHBOARD_MINISTERE.TOP_ETABLISSEMENTS,
      {
        params: cleanFilters,
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }

  /**
   * Récupérer le résumé des revenus
   * @param filters - Filtres optionnels
   * @param cookieHeader - Cookie header pour l'authentification (Server Components)
   * @returns Résumé des revenus
   */
  async getRevenueSummary(
    filters?: DashboardFilters,
    cookieHeader?: string
  ): Promise<RevenueSummary> {
    // Nettoyer les filtres pour ne pas envoyer de valeurs vides ou undefined
    const cleanFilters: Record<string, string> = {};
    if (filters?.startDate && typeof filters.startDate === "string" && filters.startDate.trim() !== "")
      cleanFilters.startDate = filters.startDate.trim();
    if (filters?.endDate && typeof filters.endDate === "string" && filters.endDate.trim() !== "")
      cleanFilters.endDate = filters.endDate.trim();
    if (filters?.etablissementId && typeof filters.etablissementId === "string" && filters.etablissementId.trim() !== "")
      cleanFilters.etablissementId = filters.etablissementId.trim();
    if (filters?.documentTypeId && typeof filters.documentTypeId === "string" && filters.documentTypeId.trim() !== "")
      cleanFilters.documentTypeId = filters.documentTypeId.trim();

    return apiClient.get<RevenueSummary>(
      API_ENDPOINTS.DASHBOARD_MINISTERE.REVENUE_SUMMARY,
      {
        params: Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined,
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      }
    );
  }
}

// Export d'une instance singleton
export const governmentDashboardService = new GovernmentDashboardService();

