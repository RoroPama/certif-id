"use client";

import { useState, useMemo, useCallback } from "react";
import { MOCK_CERTIFICATION_REQUESTS } from "../utils/mockData";
import type { CertificationRequest, CertificationItemStatus } from "../types";

const ITEMS_PER_PAGE = 10;

export function useCertifications() {
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<CertificationRequest[]>(
    MOCK_CERTIFICATION_REQUESTS
  );

  // Filtrer les demandes
  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    if (filter === "pending") {
      return requests.filter(
        (r) => r.status === "PENDING" || r.status === "PARTIAL"
      );
    }
    if (filter === "completed") {
      return requests.filter((r) => r.status === "COMPLETED");
    }
    return requests;
  }, [requests, filter]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  // Handlers
  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getRequestById = useCallback(
    (id: string) => {
      return requests.find((r) => r.id === id) || null;
    },
    [requests]
  );

  const updateItemStatus = useCallback(
    (
      requestId: string,
      itemId: string,
      status: CertificationItemStatus,
      rejectionReason?: string
    ) => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req;

          const updatedItems = req.items.map((item) =>
            item.id === itemId
              ? { ...item, status, rejectionReason }
              : item
          );

          const processedCount = updatedItems.filter(
            (i) => i.status !== "PENDING"
          ).length;

          let newStatus = req.status;
          if (processedCount === updatedItems.length) {
            newStatus = "COMPLETED";
          } else if (processedCount > 0) {
            newStatus = "PARTIAL";
          }

          return {
            ...req,
            items: updatedItems,
            processedCount,
            status: newStatus,
          };
        })
      );
    },
    []
  );

  const bulkValidateItems = useCallback((requestId: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const updatedItems = req.items.map((item) =>
          item.status === "PENDING" ? { ...item, status: "APPROVED" as const } : item
        );

        return {
          ...req,
          items: updatedItems,
          processedCount: updatedItems.length,
          status: "COMPLETED",
        };
      })
    );
  }, []);

  const bulkRejectItems = useCallback(
    (requestId: string, reason: string) => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req;

          const updatedItems = req.items.map((item) =>
            item.status === "PENDING"
              ? { ...item, status: "REJECTED" as const, rejectionReason: reason }
              : item
          );

          return {
            ...req,
            items: updatedItems,
            processedCount: updatedItems.length,
            status: "COMPLETED",
          };
        })
      );
    },
    []
  );

  // Stats pour un request
  const getRequestStats = useCallback((request: CertificationRequest) => {
    const approved = request.items.filter((i) => i.status === "APPROVED").length;
    const rejected = request.items.filter((i) => i.status === "REJECTED").length;
    const pending = request.items.filter((i) => i.status === "PENDING").length;
    return { approved, rejected, pending };
  }, []);

  return {
    requests: paginatedRequests,
    allRequests: requests,
    totalCount: filteredRequests.length,
    currentPage,
    totalPages,
    filter,
    handleFilterChange,
    handlePageChange,
    getRequestById,
    updateItemStatus,
    bulkValidateItems,
    bulkRejectItems,
    getRequestStats,
  };
}

