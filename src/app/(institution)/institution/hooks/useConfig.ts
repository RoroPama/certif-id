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
        
        // Récupérer les parcours et les types de documents depuis le backend
        const [parcours, documentTypes] = await Promise.all([
          configService.getAllParcours(),
          configService.getAllDocumentTypes(),
        ]);
        
        // Transformer les parcours en filières avec leurs diplômes associés
        const filieresData: Filiere[] = parcours.map((p) => {
          // Trouver les diplômes associés à ce parcours
          const diplomas = documentTypes
            .filter((dt) => dt.parcours?.some((parc) => parc.id === p.id))
            .map((dt) => ({
              id: dt.id,
              name: dt.nom,
            }));
          
          return {
            id: p.id,
            name: p.nom,
            diplomas,
          };
        });
        
        // Ajouter les diplômes sans parcours dans une catégorie "Autres"
        const diplomesSansParcours = documentTypes.filter(
          (dt) => !dt.parcours || dt.parcours.length === 0
        );
        
        if (diplomesSansParcours.length > 0) {
          filieresData.push({
            id: "autres",
            name: "Autres diplômes",
            diplomas: diplomesSansParcours.map((dt) => ({
              id: dt.id,
              name: dt.nom,
            })),
          });
        }
        
        setFilieres(filieresData);
        // Année de fondation par défaut (peut être ajustée si nécessaire)
        setFoundationYear(new Date().getFullYear() - 10);
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

