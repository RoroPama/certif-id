/**
 * Hook personnalisé pour la logique de configuration académique
 */

import { useState, useMemo } from "react";
import type { Filiere, AcademicYear } from "../types";
import { generateMockFilieres } from "../utils/mockData";

interface UseConfigProps {
  initialFilieres?: Filiere[];
  initialFoundationYear?: number;
}

export function useConfig({
  initialFilieres = generateMockFilieres(),
  initialFoundationYear = 2010,
}: UseConfigProps = {}) {
  const [filieres, setFilieres] = useState<Filiere[]>(initialFilieres);
  const [foundationYear, setFoundationYear] = useState<number>(initialFoundationYear);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const generated: AcademicYear[] = [];
    for (let y = currentYear; y >= foundationYear; y--) {
      generated.push({
        id: y.toString(),
        label: `${y}-${y + 1}`,
        isCurrent: y === currentYear,
      });
    }
    return generated;
  }, [foundationYear]);

  const handleAddFiliere = (filiereName: string) => {
    if (!filiereName.trim()) {
      alert("Veuillez entrer un nom de filière.");
      return;
    }
    const newFiliere: Filiere = {
      id: Date.now().toString(),
      name: filiereName,
      diplomas: [],
    };
    setFilieres([...filieres, newFiliere]);
  };

  const handleAddDiploma = (filiereId: string, diplomaName: string) => {
    if (!diplomaName.trim()) {
      alert("Veuillez entrer un intitulé de diplôme.");
      return;
    }
    setFilieres(
      filieres.map((f) => {
        if (f.id === filiereId) {
          return {
            ...f,
            diplomas: [
              ...f.diplomas,
              {
                id: Date.now().toString(),
                name: diplomaName,
              },
            ],
          };
        }
        return f;
      })
    );
  };

  const handleDeleteDiploma = (filiereId: string, diplomaId: string) => {
    if (confirm("Supprimer cet intitulé de diplôme ?")) {
      setFilieres(
        filieres.map((f) => {
          if (f.id === filiereId) {
            return {
              ...f,
              diplomas: f.diplomas.filter((d) => d.id !== diplomaId),
            };
          }
          return f;
        })
      );
    }
  };

  const handleDeleteFiliere = (id: string) => {
    if (
      confirm(
        "Supprimer cette filière ? Cela n'affectera pas les diplômes déjà émis."
      )
    ) {
      setFilieres(filieres.filter((f) => f.id !== id));
    }
  };

  const handleFoundationYearChange = (year: number) => {
    setFoundationYear(year);
  };

  return {
    filieres,
    foundationYear,
    years,
    handleAddFiliere,
    handleAddDiploma,
    handleDeleteDiploma,
    handleDeleteFiliere,
    handleFoundationYearChange,
  };
}

