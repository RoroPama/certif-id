"use client";

import { useState, useMemo, useCallback } from "react";
import { MOCK_UNIVERSITIES, MOCK_FILIERES } from "../utils/mockData";
import type { University, Filiere, UniversityFormData, UniversityStatus } from "../types";

const ITEMS_PER_PAGE = 10;

export function useUniversities() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [universities, setUniversities] = useState<University[]>(MOCK_UNIVERSITIES);

  // Filtrer les universités
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.rector.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || u.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [universities, search, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUniversities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUniversities, currentPage]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getUniversityById = useCallback(
    (id: string) => {
      return universities.find((u) => u.id === id) || null;
    },
    [universities]
  );

  const updateUniversity = useCallback(
    (id: string, updates: UniversityFormData) => {
      setUniversities((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
      );
    },
    []
  );

  const addUniversity = useCallback((data: UniversityFormData) => {
    const newUniversity: University = {
      id: `univ-${Date.now()}`,
      name: data.name || "",
      type: data.type || "PUBLIC",
      rector: data.rector || "",
      email: data.email || "",
      city: data.city || "",
      status: "PENDING",
      diplomaCount: 0,
      lastActivity: new Date().toISOString().split("T")[0],
      filieres: data.filieres || [],
      phone: data.phone,
      address: data.address,
      description: data.description,
    };
    setUniversities((prev) => [...prev, newUniversity]);
    return newUniversity;
  }, []);

  const updateUniversityStatus = useCallback(
    (id: string, status: UniversityStatus) => {
      setUniversities((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status } : u))
      );
    },
    []
  );

  const addFiliereToUniversity = useCallback(
    (universityId: string, filiere: Filiere) => {
      setUniversities((prev) =>
        prev.map((u) =>
          u.id === universityId
            ? { ...u, filieres: [...u.filieres, filiere] }
            : u
        )
      );
    },
    []
  );

  const removeFiliereFromUniversity = useCallback(
    (universityId: string, filiereId: string) => {
      setUniversities((prev) =>
        prev.map((u) =>
          u.id === universityId
            ? { ...u, filieres: u.filieres.filter((f) => f.id !== filiereId) }
            : u
        )
      );
    },
    []
  );

  return {
    universities: paginatedUniversities,
    allUniversities: universities,
    totalCount: filteredUniversities.length,
    currentPage,
    totalPages,
    search,
    typeFilter,
    editingUniversity,
    availableFilieres: MOCK_FILIERES,
    handleSearchChange,
    handleTypeFilterChange,
    handlePageChange,
    setEditingUniversity,
    getUniversityById,
    updateUniversity,
    addUniversity,
    updateUniversityStatus,
    addFiliereToUniversity,
    removeFiliereFromUniversity,
  };
}

