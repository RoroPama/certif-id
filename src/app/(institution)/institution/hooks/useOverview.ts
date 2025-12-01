/**
 * Hook personnalisé pour la logique du tableau de bord (Overview)
 */

import { useMemo } from "react";
import type { ApprovedDiploma, SubmittedRequest, Filiere } from "../types";

interface UseOverviewProps {
  registryData: ApprovedDiploma[];
  historyData: SubmittedRequest[];
  filieres: Filiere[];
}

interface OverviewStats {
  totalCertified: number;
  pendingRequests: number;
  activeFilieres: number;
}

export function useOverview({ registryData, historyData, filieres }: UseOverviewProps) {
  const stats: OverviewStats = useMemo(() => ({
    totalCertified: registryData.length,
    pendingRequests: historyData.reduce((acc, curr) => acc + curr.pendingCount, 0),
    activeFilieres: filieres.length,
  }), [registryData, historyData, filieres]);

  const recentActivity = useMemo(() => {
    return historyData.slice(0, 3);
  }, [historyData]);

  return {
    stats,
    recentActivity,
  };
}

