/**
 * Hook personnalisé pour la logique de la fiche institutionnelle
 */

import { useState, useEffect } from "react";
import { configService, type EtablissementProfile } from "@/lib/services/config.service";

interface InstitutionData {
  address: string;
  email: string;
  telephone: string;
}

export function useInstitution() {
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    address: "",
    email: "",
    telephone: "",
  });
  const [universityName, setUniversityName] = useState<string>("");
  const [numeroDecret, setNumeroDecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Récupérer les données depuis le backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const profile = await configService.getProfile();
        
        setUniversityName(profile.nom);
        setNumeroDecret(profile.numeroDecret);
        setInstitutionData({
          address: profile.adresse || "",
          email: profile.email || "",
          telephone: profile.telephone || "",
        });
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
        setError(
          err instanceof Error 
            ? err.message 
            : "Erreur lors du chargement du profil"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Mettre à jour via l'API
      await configService.updateProfile({
        nom: universityName,
        adresse: institutionData.address,
        email: institutionData.email,
        telephone: institutionData.telephone,
      });

      setSuccessMessage("Profil mis à jour avec succès !");
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Erreur lors de la mise à jour du profil"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof InstitutionData, value: string) => {
    setInstitutionData({
      ...institutionData,
      [field]: value,
    });
    // Effacer les messages d'erreur/succès lors de la modification
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  return {
    universityName,
    numeroDecret,
    institutionData,
    isLoading,
    isSaving,
    error,
    successMessage,
    handleUpdateInstitution,
    handleFieldChange,
  };
}

