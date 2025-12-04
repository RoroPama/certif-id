"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { governmentService } from "@/lib/services/government.service";
import { mapDemandeToCertificationRequest } from "../utils/demandeMapper";
import type { CertificationRequest, CertificationItemStatus } from "../types";

const ITEMS_PER_PAGE = 10;

export function useCertifications() {
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<CertificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les demandes depuis l'API
  useEffect(() => {
    let isMounted = true;

    const fetchDemandes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Mapper le filtre frontend vers le filtre backend
        let statutFilter: "EN_ATTENTE" | "TRAITEE" | "REJETEE" | undefined;
        if (filter === "pending") {
          statutFilter = "EN_ATTENTE";
        } else if (filter === "completed") {
          // Pour "completed", on récupère toutes les demandes et on filtre côté client
          statutFilter = undefined;
        }

        const response = await governmentService.getAllDemandes({
          statut: statutFilter,
          limit: 100, // Récupérer toutes les demandes pour la pagination côté client
        });

        if (!isMounted) return;

        // Mapper les demandes backend vers le format frontend
        const mappedRequests = response.demandes.map((demande) =>
          mapDemandeToCertificationRequest(demande)
        );

        // Filtrer les demandes "completed" si nécessaire
        let filtered = mappedRequests;
        if (filter === "completed") {
          filtered = mappedRequests.filter((r) => r.status === "COMPLETED");
        }

        setRequests(filtered);
      } catch (err) {
        if (!isMounted) return;
        console.error("Erreur lors du chargement des demandes:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des demandes"
        );
        setRequests([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDemandes();

    return () => {
      isMounted = false;
    };
  }, [filter]);

  // Les demandes sont déjà filtrées lors du chargement depuis l'API
  const filteredRequests = requests;

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
    async (id: string): Promise<CertificationRequest | null> => {
      try {
        // D'abord chercher dans les requêtes déjà chargées
        const cached = requests.find((r) => r.id === id);
        if (cached) return cached;

        // Sinon, charger depuis l'API
        const demande = await governmentService.getDemandeById(id);
        return mapDemandeToCertificationRequest(demande);
      } catch (err) {
        console.error("Erreur lors du chargement de la demande:", err);
        return null;
      }
    },
    [requests]
  );

  const updateItemStatus = useCallback(
    async (
      requestId: string,
      itemId: string,
      status: CertificationItemStatus,
      rejectionReason?: string
    ) => {
      try {
        if (status === "APPROVED") {
          // Utiliser bulkApproveDocuments avec seulement cet item
          await governmentService.bulkApproveDocuments(requestId, {
            documentIds: [itemId],
          });
        } else if (status === "REJECTED") {
          await governmentService.rejectDocument(requestId, itemId, {
            raisonRejet: rejectionReason || "Rejeté par le ministère",
            commentaire: rejectionReason,
          });
        }

        // Recharger la demande mise à jour
        const updatedDemande = await governmentService.getDemandeById(requestId);
        const mappedRequest = mapDemandeToCertificationRequest(updatedDemande);

        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mappedRequest : req))
        );

        return mappedRequest;
      } catch (err) {
        console.error("Erreur lors de la mise à jour du statut:", err);
        throw err;
      }
    },
    []
  );

  const bulkValidateItems = useCallback(async (requestId: string) => {
    try {
      await governmentService.bulkApproveDocuments(requestId, {});

      // Recharger la demande mise à jour
      const updatedDemande = await governmentService.getDemandeById(requestId);
      const mappedRequest = mapDemandeToCertificationRequest(updatedDemande);

      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? mappedRequest : req))
      );
    } catch (err) {
      console.error("Erreur lors de l'approbation en masse:", err);
      throw err;
    }
  }, []);

  const bulkRejectItems = useCallback(
    async (requestId: string, reason: string) => {
      try {
        await governmentService.bulkRejectDocuments(requestId, {
          raisonRejet: reason,
          commentaire: reason,
        });

        // Recharger la demande mise à jour
        const updatedDemande = await governmentService.getDemandeById(requestId);
        const mappedRequest = mapDemandeToCertificationRequest(updatedDemande);

        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mappedRequest : req))
        );
      } catch (err) {
        console.error("Erreur lors du rejet en masse:", err);
        throw err;
      }
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
    isLoading,
    error,
    handleFilterChange,
    handlePageChange,
    getRequestById,
    updateItemStatus,
    bulkValidateItems,
    bulkRejectItems,
    getRequestStats,
    refreshRequests: () => {
      // Déclencher un rechargement en changeant temporairement le filtre
      setFilter((prev) => prev);
    },
  };
}

