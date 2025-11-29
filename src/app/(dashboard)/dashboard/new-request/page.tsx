/**
 * Server Component - Page nouvelle demande
 */

import NewRequestPageClient from "./pageClient";

// Données de filières par défaut (normalement viendraient d'une API)
const defaultFilieres = [
  { id: "1", name: "Droit Public", diplomaName: "Licence en Droit Public" },
  { id: "2", name: "Informatique de Gestion", diplomaName: "Master en Informatique Appliquée" },
  { id: "3", name: "Sciences Économiques", diplomaName: "Licence en Économie du Développement" },
  { id: "4", name: "Sociologie", diplomaName: "Licence en Sociologie" },
];

export default function NewRequestPage() {
  return (
    <NewRequestPageClient
      initialFilieres={defaultFilieres}
      foundationYear={2010}
    />
  );
}

