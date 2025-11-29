/**
 * Hook personnalisé pour la logique de gestion des demandes
 */

import { useState, useMemo } from "react";
import type { SubmittedRequest } from "../types";

interface UseRequestsProps {
  initialData: SubmittedRequest[];
}

export function useRequests({ initialData }: UseRequestsProps) {
  const [historyData, setHistoryData] = useState<SubmittedRequest[]>(initialData);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyFilterType, setHistoryFilterType] = useState("all");
  const itemsPerPage = 6;

  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      if (historyFilterType === "all") return true;
      if (historyFilterType === "attention") return item.rejectedCount > 0;
      if (historyFilterType === "completed") return item.pendingCount === 0;
      return true;
    });
  }, [historyData, historyFilterType]);

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, historyPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleFilterChange = (filter: string) => {
    setHistoryFilterType(filter);
    setHistoryPage(1);
  };

  const handlePageChange = (page: number) => {
    setHistoryPage(page);
  };

  const addRequest = (request: SubmittedRequest) => {
    setHistoryData([request, ...historyData]);
    setHistoryPage(1);
  };

  const getRequestById = (id: string): SubmittedRequest | undefined => {
    return historyData.find((req) => req.id === id);
  };

  return {
    historyData,
    filteredHistory,
    paginatedHistory,
    historyPage,
    totalPages,
    historyFilterType,
    handleFilterChange,
    handlePageChange,
    addRequest,
    getRequestById,
  };
}

