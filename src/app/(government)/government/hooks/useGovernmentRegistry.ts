"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { RegistryEntry } from "../types";

const ITEMS_PER_PAGE = 10;

interface UseGovernmentRegistryProps {
  initialData?: RegistryEntry[];
}

export function useGovernmentRegistry(props?: UseGovernmentRegistryProps) {
  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entries, setEntries] = useState<RegistryEntry[]>(
    props?.initialData || []
  );

  // Mettre à jour les entrées si les données initiales changent
  useEffect(() => {
    if (props?.initialData) {
      setEntries(props.initialData);
    }
  }, [props?.initialData]);

  // Extraire les universités uniques depuis les entrées
  const universities = useMemo(() => {
    const uniqueUniversities = new Map<string, { id: string; name: string }>();
    entries.forEach((entry) => {
      if (!uniqueUniversities.has(entry.universityName)) {
        uniqueUniversities.set(entry.universityName, {
          id: entry.universityName,
          name: entry.universityName,
        });
      }
    });
    return Array.from(uniqueUniversities.values());
  }, [entries]);

  // Extraire les années uniques depuis les entrées
  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    entries.forEach((entry) => {
      if (entry.year) {
        uniqueYears.add(entry.year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  // Filtrer les entrées
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Filtre par recherche
      const matchesSearch =
        search === "" ||
        entry.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        entry.studentName.toLowerCase().includes(search.toLowerCase()) ||
        entry.diplomaTitle.toLowerCase().includes(search.toLowerCase());

      // Filtre par université
      const matchesUniversity =
        universityFilter === "all" || entry.universityName === universityFilter;

      // Filtre par année
      const matchesYear = yearFilter === "all" || entry.year === yearFilter;

      // Filtre par statut
      const matchesStatus =
        statusFilter === "all" || entry.status === statusFilter;

      return matchesSearch && matchesUniversity && matchesYear && matchesStatus;
    });
  }, [entries, search, universityFilter, yearFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleUniversityFilterChange = useCallback((value: string) => {
    setUniversityFilter(value);
    setCurrentPage(1);
  }, []);

  const handleYearFilterChange = useCallback((value: string) => {
    setYearFilter(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getEntryById = useCallback(
    (id: string) => {
      return entries.find((e) => e.id === id) || null;
    },
    [entries]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setUniversityFilter("all");
    setYearFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  }, []);

  return {
    entries: paginatedEntries,
    allEntries: entries,
    totalCount: filteredEntries.length,
    currentPage,
    totalPages,
    search,
    universityFilter,
    yearFilter,
    statusFilter,
    universities,
    years,
    handleSearchChange,
    handleUniversityFilterChange,
    handleYearFilterChange,
    handleStatusFilterChange,
    handlePageChange,
    getEntryById,
    resetFilters,
  };
}

