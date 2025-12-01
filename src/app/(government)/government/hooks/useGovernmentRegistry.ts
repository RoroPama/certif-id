"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MOCK_REGISTRY_ENTRIES,
  MOCK_UNIVERSITIES,
  AVAILABLE_YEARS,
} from "../utils/mockData";
import type { RegistryEntry } from "../types";

const ITEMS_PER_PAGE = 10;

export function useGovernmentRegistry() {
  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entries] = useState<RegistryEntry[]>(MOCK_REGISTRY_ENTRIES);

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
        universityFilter === "all" ||
        entry.universityName ===
          MOCK_UNIVERSITIES.find((u) => u.id === universityFilter)?.name;

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
    universities: MOCK_UNIVERSITIES,
    years: AVAILABLE_YEARS,
    handleSearchChange,
    handleUniversityFilterChange,
    handleYearFilterChange,
    handleStatusFilterChange,
    handlePageChange,
    getEntryById,
    resetFilters,
  };
}

