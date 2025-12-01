/**
 * Hook personnalisé pour la logique de la fiche institutionnelle
 */

import { useState } from "react";

interface InstitutionData {
  address: string;
  email: string;
  rector: string;
}

interface UseInstitutionProps {
  initialData?: InstitutionData;
}

const defaultInstitutionData: InstitutionData = {
  address: "B.P. 69, Brazzaville",
  email: "contact@umng.cg",
  rector: "Pr. Gontran Ondzotto",
};

export function useInstitution({ initialData }: UseInstitutionProps = {}) {
  const [universityName] = useState("Université Marien Ngouabi");
  const [institutionData, setInstitutionData] = useState<InstitutionData>(
    initialData || defaultInstitutionData
  );

  const handleUpdateInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez appeler une API pour sauvegarder les données
    alert("Paramètres de l'institution mis à jour avec succès !");
  };

  const handleFieldChange = (field: keyof InstitutionData, value: string) => {
    setInstitutionData({
      ...institutionData,
      [field]: value,
    });
  };

  return {
    universityName,
    institutionData,
    setInstitutionData,
    handleUpdateInstitution,
    handleFieldChange,
  };
}

