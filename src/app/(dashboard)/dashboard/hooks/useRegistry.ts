/**
 * Hook personnalisé pour la logique du registre des diplômes
 */

import { useState, useMemo } from "react";
import type { ApprovedDiploma } from "../types";

interface UseRegistryProps {
  initialData: ApprovedDiploma[];
}

export function useRegistry({ initialData }: UseRegistryProps) {
  const [registryData] = useState<ApprovedDiploma[]>(initialData);
  const [registryPage, setRegistryPage] = useState(1);
  const [registrySearch, setRegistrySearch] = useState("");
  const [registryFilterYear, setRegistryFilterYear] = useState("all");
  const itemsPerPage = 8;

  const filteredRegistry = useMemo(() => {
    return registryData.filter((item) => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(registrySearch.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(registrySearch.toLowerCase()) ||
        item.diplomaTitle.toLowerCase().includes(registrySearch.toLowerCase());
      const matchesYear =
        registryFilterYear === "all" || item.year === registryFilterYear;
      return matchesSearch && matchesYear;
    });
  }, [registryData, registrySearch, registryFilterYear]);

  const paginatedRegistry = useMemo(() => {
    const start = (registryPage - 1) * itemsPerPage;
    return filteredRegistry.slice(start, start + itemsPerPage);
  }, [filteredRegistry, registryPage]);

  const totalPages = Math.ceil(filteredRegistry.length / itemsPerPage);

  const handleSearchChange = (search: string) => {
    setRegistrySearch(search);
    setRegistryPage(1);
  };

  const handlePageChange = (page: number) => {
    setRegistryPage(page);
  };

  const handleYearFilterChange = (year: string) => {
    setRegistryFilterYear(year);
    setRegistryPage(1);
  };

  const getDiplomaById = (id: string): ApprovedDiploma | undefined => {
    return registryData.find((diploma) => diploma.id === id);
  };

  return {
    registryData,
    filteredRegistry,
    paginatedRegistry,
    registryPage,
    totalPages,
    registrySearch,
    registryFilterYear,
    handleSearchChange,
    handlePageChange,
    handleYearFilterChange,
    getDiplomaById,
  };
}

