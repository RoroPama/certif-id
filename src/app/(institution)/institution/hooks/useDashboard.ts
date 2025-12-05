/**
 * Hook personnalisé pour la logique du dashboard
 */

import { useState, useEffect } from "react";
import { dashboardService } from "@/lib/services/dashboard.service";
import type {
  DashboardOverview,
  DashboardStats,
  DashboardReports,
  DashboardFilters,
} from "@/lib/services/dashboard.service";

interface UseDashboardProps {
  filters?: DashboardFilters;
}

interface UseDashboardReturn {
  overview: DashboardOverview | null;
  stats: DashboardStats | null;
  reports: DashboardReports | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard({
  filters,
}: UseDashboardProps = {}): UseDashboardReturn {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<DashboardReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewData, statsData, reportsData] = await Promise.all([
        dashboardService.getOverview(filters),
        dashboardService.getStats(filters),
        dashboardService.getReports(),
      ]);

      setOverview(overviewData);
      setStats(statsData);
      setReports(reportsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement des données";
      setError(errorMessage);
      console.error("Erreur dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters?.dateDebut, filters?.dateFin]);

  return {
    overview,
    stats,
    reports,
    loading,
    error,
    refetch: fetchData,
  };
}

