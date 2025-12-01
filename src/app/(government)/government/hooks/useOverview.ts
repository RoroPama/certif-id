"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MOCK_UNIVERSITIES,
  MOCK_REGISTRY_ENTRIES,
  MOCK_FILIERES,
  AVAILABLE_YEARS,
  calculateStats,
} from "../utils/mockData";

interface Filters {
  universityId: string;
  type: string;
  year: string;
  filiereId: string;
}

export function useOverview() {
  const [filters, setFilters] = useState<Filters>({
    universityId: "all",
    type: "all",
    year: "all",
    filiereId: "all",
  });

  // Filtrer les données du registre selon les filtres actifs
  const filteredRegistry = useMemo(() => {
    return MOCK_REGISTRY_ENTRIES.filter((entry) => {
      // Filtre par université
      if (filters.universityId !== "all") {
        const university = MOCK_UNIVERSITIES.find(
          (u) => u.id === filters.universityId
        );
        if (university && entry.universityName !== university.name) {
          return false;
        }
      }

      // Filtre par type d'université
      if (filters.type !== "all") {
        const university = MOCK_UNIVERSITIES.find(
          (u) => u.name === entry.universityName
        );
        if (university && university.type !== filters.type) {
          return false;
        }
      }

      // Filtre par année
      if (filters.year !== "all" && entry.year !== filters.year) {
        return false;
      }

      // Filtre par filière
      if (filters.filiereId !== "all") {
        const filiere = MOCK_FILIERES.find((f) => f.id === filters.filiereId);
        if (filiere && entry.filiere !== filiere.name) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Filtrer les universités selon le type
  const filteredUniversities = useMemo(() => {
    if (filters.type === "all") {
      return MOCK_UNIVERSITIES;
    }
    return MOCK_UNIVERSITIES.filter((u) => u.type === filters.type);
  }, [filters.type]);

  // Calculer les stats avec les données filtrées
  const stats = useMemo(() => {
    return calculateStats(filteredRegistry, filteredUniversities);
  }, [filteredRegistry, filteredUniversities]);

  const handleFilterChange = useCallback(
    (key: keyof Filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      universityId: "all",
      type: "all",
      year: "all",
      filiereId: "all",
    });
  }, []);

  return {
    stats,
    filters,
    universities: MOCK_UNIVERSITIES,
    years: AVAILABLE_YEARS,
    filieres: MOCK_FILIERES,
    handleFilterChange,
    resetFilters,
  };
}

