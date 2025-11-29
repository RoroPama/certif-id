/**
 * Hook personnalisé pour la logique de configuration académique
 */

import { useState, useMemo } from "react";
import type { Filiere, AcademicYear } from "../types";

interface UseConfigProps {
  initialFilieres?: Filiere[];
  initialFoundationYear?: number;
}

const defaultFilieres: Filiere[] = [
  { id: "1", name: "Droit Public", diplomaName: "Licence en Droit Public" },
  {
    id: "2",
    name: "Informatique de Gestion",
    diplomaName: "Master en Informatique Appliquée",
  },
  {
    id: "3",
    name: "Sciences Économiques",
    diplomaName: "Licence en Économie du Développement",
  },
  { id: "4", name: "Sociologie", diplomaName: "Licence en Sociologie" },
];

export function useConfig({
  initialFilieres = defaultFilieres,
  initialFoundationYear = 2010,
}: UseConfigProps = {}) {
  const [filieres, setFilieres] = useState<Filiere[]>(initialFilieres);
  const [foundationYear, setFoundationYear] = useState<number>(initialFoundationYear);
  const [newFiliere, setNewFiliere] = useState({ name: "", diplomaName: "" });

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

  const handleAddFiliere = () => {
    if (!newFiliere.name || !newFiliere.diplomaName) {
      alert("Veuillez remplir le nom de la filière et l'intitulé du diplôme.");
      return;
    }
    setFilieres([...filieres, { id: Date.now().toString(), ...newFiliere }]);
    setNewFiliere({ name: "", diplomaName: "" });
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
    newFiliere,
    years,
    setNewFiliere,
    handleAddFiliere,
    handleDeleteFiliere,
    handleFoundationYearChange,
  };
}

