/**
 * Hook personnalisé pour la logique du dashboard gouvernement
 */

import { useState, useEffect } from "react";
import { governmentDashboardService } from "@/lib/services/government-dashboard.service";
import type {
  DashboardStats,
  DashboardFilters,
  TopEtablissement,
  RevenueSummary,
} from "@/lib/services/government-dashboard.service";

interface UseGovernmentDashboardProps {
  filters?: DashboardFilters;
}

interface UseGovernmentDashboardReturn {
  stats: DashboardStats | null;
  topEtablissements: TopEtablissement[];
  revenueSummary: RevenueSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGovernmentDashboard({
  filters,
}: UseGovernmentDashboardProps = {}): UseGovernmentDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topEtablissements, setTopEtablissements] = useState<
    TopEtablissement[]
  >([]);
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Utiliser Promise.allSettled pour ne pas faire échouer toutes les requêtes si une seule échoue
      const results = await Promise.allSettled([
        governmentDashboardService.getStats(filters),
        governmentDashboardService.getTopEtablissements(10, filters),
        governmentDashboardService.getRevenueSummary(filters),
      ]);

      // Traiter chaque résultat
      if (results[0].status === "fulfilled") {
        setStats(results[0].value);
      } else {
        console.error("Erreur lors du chargement des stats:", results[0].reason);
        setError(
          results[0].reason instanceof Error
            ? results[0].reason.message
            : "Erreur lors du chargement des statistiques"
        );
      }

      if (results[1].status === "fulfilled") {
        setTopEtablissements(results[1].value);
      } else {
        console.error(
          "Erreur lors du chargement du top établissements:",
          results[1].reason
        );
      }

      if (results[2].status === "fulfilled") {
        setRevenueSummary(results[2].value);
      } else {
        console.error(
          "Erreur lors du chargement du résumé des revenus:",
          results[2].reason
        );
      }

      // Si toutes les requêtes ont échoué, définir une erreur globale
      if (
        results[0].status === "rejected" &&
        results[1].status === "rejected" &&
        results[2].status === "rejected"
      ) {
        const firstError =
          results[0].reason instanceof Error
            ? results[0].reason.message
            : "Erreur lors du chargement des données";
        setError(firstError);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données";
      setError(errorMessage);
      console.error("Erreur dashboard gouvernement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    filters?.startDate,
    filters?.endDate,
    filters?.etablissementId,
    filters?.documentTypeId,
  ]);

  return {
    stats,
    topEtablissements,
    revenueSummary,
    loading,
    error,
    refetch: fetchData,
  };
}

