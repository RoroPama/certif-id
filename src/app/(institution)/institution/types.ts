/**
 * Types partagés pour le dashboard
 */

export type DiplomaTitel = { id: string; name: string };

export type Filiere = { id: string; name: string; diplomas: DiplomaTitel[] };

// Type pour les parcours (remplace Filiere dans new-request)
export type Parcours = { id: string; name: string; diplomas: DiplomaTitel[] };

// Type pour les diplômes avec leurs parcours associés
export type DiplomeWithParcours = {
  id: string;
  name: string;
  parcours: { id: string; name: string; duree: string }[];
};

export type AcademicYear = { id: string; label: string; isCurrent: boolean };

export type StudentDraft = {
  id: string;
  firstName: string;
  lastName: string;
  sex: "M" | "F";
  yearId: string;
  parcoursId?: string; // Optionnel - certains diplômes n'ont pas de parcours (ex: BEPC)
  diplomaId: string;
  diplomaName: string;
  mention: string;
  pdfFile: File | null;
  fileName: string;
};

export type ApprovedDiploma = {
  id: string;
  studentName: string;
  diplomaTitle: string;
  year: string;
  issueDate: string;
  serialNumber: string;
  status: "active" | "revoked";
  mention: string;
  filiere: string;
  pdfSigneUrl?: string;
};

// Type pour un document dans une demande (basé sur la structure backend)
export type RequestDocument = {
  id: string;
  documentTypeId: string;
  status: null | "APPROUVE" | "REJETE";
  pdfOriginalUrl?: string;
  matricule?: string;
  nomBeneficiaire: string;
  prenomBeneficiaire: string;
  dateNaissance?: Date | string;
  lieuNaissance?: string;
  dateEmission: Date | string;
  emetteur: string;
  documentTypeNom: string;
  documentTypePrix: number;
  montantTotal: number;
  documentTypeDescription?: string;
  raisonRejet?: string | null;
  commentaireRejet?: string | null;
  documentSigne?: {
    id: string;
    pdfSigneUrl: string;
    qrCodeData: string;
    signataireId: string;
    createdAt: Date | string;
  };
  documentType: {
    id: string;
    nom: string;
    description?: string;
    prix: number;
  };
};

// Type pour une demande (basé sur DemandeEntity du backend + champs enrichis)
export type SubmittedRequest = {
  // Champs du backend
  id: string;
  etablissementId: string;
  statut: string;
  note?: string;
  documents: RequestDocument[];
  etablissement: {
    id: string;
    nom: string;
    type: string;
    email: string;
    telephone: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  // Champs enrichis/calculés
  reference: string;
  submissionDate: string;
  academicYear: string;
  totalCount: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
};

export type DashboardTab =
  | "overview"
  | "institution"
  | "config"
  | "new-request"
  | "requests-history"
  | "registry";

