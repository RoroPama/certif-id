/**
 * Hook personnalisé pour la logique de configuration académique
 */

import { useState, useMemo, useEffect } from "react";
import type { Filiere, AcademicYear } from "../types";
import { configService } from "@/lib/services/config.service";

export function useConfig() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [foundationYear, setFoundationYear] = useState<number>(new Date().getFullYear() - 10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer la configuration académique depuis le backend
        const config = await configService.getAcademicConfig();
        
        setFilieres(config.filieres);
        setFoundationYear(config.foundationYear);
      } catch (err) {
        console.error("Erreur lors de la récupération de la configuration:", err);
        setError(
          err instanceof Error 
            ? err.message 
            : "Erreur lors du chargement de la configuration"
        );
        // En cas d'erreur, on garde les valeurs par défaut
        setFilieres([]);
        setFoundationYear(new Date().getFullYear() - 10);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

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

  return {
    filieres,
    foundationYear,
    years,
    isLoading,
    error,
  };
}

