"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { governmentService } from "@/lib/services/government.service";
import { mapEtablissementToUniversity, mapEtablissementsToUniversities } from "../utils/universityMapper";
import type { University, Filiere, UniversityFormData, UniversityStatus } from "../types";

const ITEMS_PER_PAGE = 10;

export function useUniversities() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les établissements depuis l'API
  useEffect(() => {
    let isMounted = true;

    const fetchEtablissements = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const etablissements = await governmentService.getAllEtablissements();
        
        if (!isMounted) return;

        // Mapper les établissements backend vers le format frontend
        const mappedUniversities = mapEtablissementsToUniversities(etablissements);
        setUniversities(mappedUniversities);
      } catch (err) {
        if (!isMounted) return;
        console.error("Erreur lors du chargement des établissements:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des établissements"
        );
        setUniversities([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEtablissements();

    return () => {
      isMounted = false;
    };
  }, []);

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
    async (id: string): Promise<University | null> => {
      try {
        // D'abord chercher dans les universités déjà chargées
        const cached = universities.find((u) => u.id === id);
        if (cached) return cached;

        // Sinon, charger depuis l'API
        const etablissement = await governmentService.getEtablissementById(id);
        return mapEtablissementToUniversity(etablissement);
      } catch (err) {
        console.error("Erreur lors du chargement de l'établissement:", err);
        return null;
      }
    },
    [universities]
  );

  const updateUniversity = useCallback(
    async (id: string, updates: UniversityFormData) => {
      try {
        // Mapper les données frontend vers le format backend
        const updateDto: any = {};
        if (updates.name) updateDto.nom = updates.name;
        if (updates.type) {
          // Convertir PUBLIC/PRIVE vers le format backend
          updateDto.type = updates.type === "PUBLIC" ? "PUBLIC" : "PRIVE";
        }
        if (updates.email) updateDto.email = updates.email;
        if (updates.phone) updateDto.telephone = updates.phone;
        if (updates.address) updateDto.adresse = updates.address;
        if (updates.filieres) {
          // Extraire les noms des types de documents depuis les filières
          updateDto.documentTypeNames = updates.filieres.flatMap(f => f.diplomas);
        }

        const updatedEtablissement = await governmentService.updateEtablissement(id, updateDto);
        const mappedUniversity = mapEtablissementToUniversity(updatedEtablissement);

        setUniversities((prev) =>
          prev.map((u) => (u.id === id ? mappedUniversity : u))
        );

        return mappedUniversity;
      } catch (err) {
        console.error("Erreur lors de la mise à jour de l'établissement:", err);
        throw err;
      }
    },
    []
  );

  const addUniversity = useCallback(async (data: UniversityFormData) => {
    try {
      if (!data.name || !data.email || !data.phone) {
        throw new Error("Le nom, l'email et le téléphone sont requis");
      }

      // Mapper les données frontend vers le format backend
      // Le backend attend des noms dans documentTypeNames et documentTypeParcoursNames
      let documentTypeNames: string[] = [];
      if (data.documentTypeNames) {
        // Si documentTypeNames est fourni directement (depuis le modal)
        documentTypeNames = data.documentTypeNames;
      } else if (data.documentTypeParcoursNames) {
        // Extraire les noms des types de documents depuis documentTypeParcoursNames
        documentTypeNames = Object.keys(data.documentTypeParcoursNames);
      } else if (data.filieres) {
        // Fallback pour compatibilité avec l'ancien format
        documentTypeNames = data.filieres.flatMap(f => f.diplomas);
      }
      
      const createDto: any = {
        nom: data.name,
        email: data.email,
        telephone: data.phone,
        type: data.type === "PUBLIC" ? "PUBLIC" : "PRIVE",
        numeroDecret: `DECRET-${Date.now()}`, // Générer un numéro de décret temporaire
        documentTypeNames: documentTypeNames, // Noms des types de documents (diplômes)
      };

      if (data.address) createDto.adresse = data.address;
      
      // Ajouter documentTypeParcoursNames si fourni (NOUVELLE MÉTHODE RECOMMANDÉE)
      if (data.documentTypeParcoursNames) {
        createDto.documentTypeParcoursNames = data.documentTypeParcoursNames;
      }

      const newEtablissement = await governmentService.createEtablissement(createDto);
      const mappedUniversity = mapEtablissementToUniversity(newEtablissement);

      setUniversities((prev) => [...prev, mappedUniversity]);
      return mappedUniversity;
    } catch (err) {
      console.error("Erreur lors de la création de l'établissement:", err);
      throw err;
    }
  }, []);

  const updateUniversityStatus = useCallback(
    async (id: string, status: UniversityStatus) => {
      // Pour l'instant, le backend ne gère pas le statut
      // On met à jour localement seulement
      setUniversities((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status } : u))
      );
      // TODO: Ajouter un endpoint backend pour mettre à jour le statut si nécessaire
    },
    []
  );

  const addFiliereToUniversity = useCallback(
    async (universityId: string, filiere: Filiere) => {
      try {
        const university = universities.find((u) => u.id === universityId);
        if (!university) throw new Error("Université introuvable");

        // Mettre à jour les types de documents autorisés
        const documentTypeNames = [
          ...university.filieres.flatMap((f) => f.diplomas),
          ...filiere.diplomas,
        ];

        const updateDto = {
          documentTypeNames: [...new Set(documentTypeNames)], // Éliminer les doublons
        };

        const updatedEtablissement = await governmentService.updateEtablissement(
          universityId,
          updateDto
        );
        const mappedUniversity = mapEtablissementToUniversity(updatedEtablissement);

        setUniversities((prev) =>
          prev.map((u) => (u.id === universityId ? mappedUniversity : u))
        );
      } catch (err) {
        console.error("Erreur lors de l'ajout de la filière:", err);
        throw err;
      }
    },
    [universities]
  );

  const removeFiliereFromUniversity = useCallback(
    async (universityId: string, filiereId: string) => {
      try {
        const university = universities.find((u) => u.id === universityId);
        if (!university) throw new Error("Université introuvable");

        // Retirer les diplômes de la filière supprimée
        const filiereToRemove = university.filieres.find((f) => f.id === filiereId);
        if (!filiereToRemove) return;

        const documentTypeNames = university.filieres
          .filter((f) => f.id !== filiereId)
          .flatMap((f) => f.diplomas);

        const updateDto = {
          documentTypeNames: [...new Set(documentTypeNames)],
        };

        const updatedEtablissement = await governmentService.updateEtablissement(
          universityId,
          updateDto
        );
        const mappedUniversity = mapEtablissementToUniversity(updatedEtablissement);

        setUniversities((prev) =>
          prev.map((u) => (u.id === universityId ? mappedUniversity : u))
        );
      } catch (err) {
        console.error("Erreur lors de la suppression de la filière:", err);
        throw err;
      }
    },
    [universities]
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
    isLoading,
    error,
    availableFilieres: [], // TODO: Charger depuis le backend si nécessaire
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
    refreshUniversities: async () => {
      // Recharger les établissements
      try {
        setIsLoading(true);
        const etablissements = await governmentService.getAllEtablissements();
        const mappedUniversities = mapEtablissementsToUniversities(etablissements);
        setUniversities(mappedUniversities);
      } catch (err) {
        console.error("Erreur lors du rechargement:", err);
      } finally {
        setIsLoading(false);
      }
    },
  };
}

