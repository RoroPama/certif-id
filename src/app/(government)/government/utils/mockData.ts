/**
 * Mock data pour le module Government
 */

import type {
  University,
  CertificationRequest,
  RegistryEntry,
  Filiere,
  DashboardStats,
} from "../types";

// ============================================================================
// FILIÈRES
// ============================================================================

export const MOCK_FILIERES: Filiere[] = [
  {
    id: "fil-1",
    name: "Sciences Juridiques",
    diplomas: ["Licence en Droit Public", "Licence en Droit Privé", "Master en Droit des Affaires"],
  },
  {
    id: "fil-2",
    name: "Sciences Économiques",
    diplomas: ["Licence en Économie", "Master en Économie Appliquée"],
  },
  {
    id: "fil-3",
    name: "Informatique",
    diplomas: ["Licence en Informatique", "Master en Génie Logiciel", "Master en Intelligence Artificielle"],
  },
  {
    id: "fil-4",
    name: "Médecine",
    diplomas: ["Doctorat en Médecine Générale", "Spécialisation en Chirurgie"],
  },
  {
    id: "fil-5",
    name: "Lettres Modernes",
    diplomas: ["Licence en Lettres", "Master en Littérature Comparée"],
  },
];

// ============================================================================
// UNIVERSITÉS
// ============================================================================

export const MOCK_UNIVERSITIES: University[] = [
  {
    id: "univ-1",
    name: "Université Marien Ngouabi",
    type: "PUBLIC",
    rector: "Pr. Jean-Rosaire IBARA",
    email: "recteur@umng.cg",
    city: "Brazzaville",
    status: "ACTIVE",
    diplomaCount: 15420,
    lastActivity: "2024-01-15",
    filieres: [MOCK_FILIERES[0], MOCK_FILIERES[1], MOCK_FILIERES[2]],
    phone: "+242 06 XXX XX XX",
    address: "Avenue de l'Université, Brazzaville",
    description: "Principale université publique de la République du Congo",
  },
  {
    id: "univ-2",
    name: "Université Denis Sassou Nguesso",
    type: "PUBLIC",
    rector: "Pr. Pierre NZILA",
    email: "recteur@udsn.cg",
    city: "Kintélé",
    status: "ACTIVE",
    diplomaCount: 3250,
    lastActivity: "2024-01-14",
    filieres: [MOCK_FILIERES[2], MOCK_FILIERES[3]],
    phone: "+242 06 XXX XX XX",
    address: "Cité Universitaire de Kintélé",
  },
  {
    id: "univ-3",
    name: "Institut Supérieur de Gestion",
    type: "PRIVE",
    rector: "Dr. Marie MOUKOKO",
    email: "direction@isg.cg",
    city: "Brazzaville",
    status: "ACTIVE",
    diplomaCount: 890,
    lastActivity: "2024-01-12",
    filieres: [MOCK_FILIERES[1]],
  },
  {
    id: "univ-4",
    name: "École Supérieure de Commerce",
    type: "PRIVE",
    rector: "Dr. Paul OKANA",
    email: "contact@esc.cg",
    city: "Pointe-Noire",
    status: "PENDING",
    diplomaCount: 0,
    lastActivity: "2024-01-10",
    filieres: [],
  },
  {
    id: "univ-5",
    name: "Institut Polytechnique de Brazzaville",
    type: "PUBLIC",
    rector: "Pr. André MASSAMBA",
    email: "direction@ipb.cg",
    city: "Brazzaville",
    status: "ACTIVE",
    diplomaCount: 2100,
    lastActivity: "2024-01-16",
    filieres: [MOCK_FILIERES[2]],
  },
  {
    id: "univ-6",
    name: "Université Libre du Congo",
    type: "PRIVE",
    rector: "Dr. Félicité NGOMA",
    email: "info@ulc.cg",
    city: "Brazzaville",
    status: "SUSPENDED",
    diplomaCount: 450,
    lastActivity: "2023-12-01",
    filieres: [MOCK_FILIERES[4]],
  },
];

// ============================================================================
// DEMANDES DE CERTIFICATION
// ============================================================================

export const MOCK_CERTIFICATION_REQUESTS: CertificationRequest[] = [
  {
    id: "req-1",
    reference: "CERT-2024-001",
    universityId: "univ-1",
    universityName: "Université Marien Ngouabi",
    submissionDate: "2024-01-15",
    totalStudents: 45,
    processedCount: 12,
    status: "PARTIAL",
    items: [
      {
        id: "item-1",
        firstName: "Jean",
        lastName: "MABIALA",
        diplomaTitle: "Licence en Droit Public",
        mention: "Bien",
        promotion: "2023",
        status: "APPROVED",
        birthDate: "1998-05-12",
        matricule: "UMN-2020-1234",
      },
      {
        id: "item-2",
        firstName: "Marie",
        lastName: "NGOMA",
        diplomaTitle: "Licence en Informatique",
        mention: "Très Bien",
        promotion: "2023",
        status: "PENDING",
        birthDate: "1999-08-23",
        matricule: "UMN-2020-1235",
        transcriptFile: "releve_ngoma.pdf",
      },
      {
        id: "item-3",
        firstName: "Paul",
        lastName: "OKAMBA",
        diplomaTitle: "Master en Économie Appliquée",
        mention: "Assez Bien",
        promotion: "2023",
        status: "REJECTED",
        rejectionReason: "Document illisible",
        birthDate: "1997-03-15",
        matricule: "UMN-2019-0892",
      },
      {
        id: "item-4",
        firstName: "Sophie",
        lastName: "LOEMBA",
        diplomaTitle: "Licence en Droit Privé",
        mention: "Bien",
        promotion: "2023",
        status: "PENDING",
        birthDate: "2000-01-20",
        matricule: "UMN-2021-0456",
      },
      {
        id: "item-5",
        firstName: "André",
        lastName: "MOUKOKO",
        diplomaTitle: "Licence en Informatique",
        mention: "Passable",
        promotion: "2023",
        status: "PENDING",
        birthDate: "1998-11-08",
        matricule: "UMN-2020-0789",
      },
    ],
  },
  {
    id: "req-2",
    reference: "CERT-2024-002",
    universityId: "univ-2",
    universityName: "Université Denis Sassou Nguesso",
    submissionDate: "2024-01-14",
    totalStudents: 28,
    processedCount: 28,
    status: "COMPLETED",
    items: [
      {
        id: "item-6",
        firstName: "Claire",
        lastName: "BONGO",
        diplomaTitle: "Doctorat en Médecine Générale",
        mention: "Très Bien",
        promotion: "2023",
        status: "APPROVED",
      },
    ],
  },
  {
    id: "req-3",
    reference: "CERT-2024-003",
    universityId: "univ-3",
    universityName: "Institut Supérieur de Gestion",
    submissionDate: "2024-01-13",
    totalStudents: 15,
    processedCount: 0,
    status: "PENDING",
    items: [
      {
        id: "item-7",
        firstName: "David",
        lastName: "NZABA",
        diplomaTitle: "Licence en Économie",
        mention: "Bien",
        promotion: "2023",
        status: "PENDING",
        birthDate: "1999-07-30",
        matricule: "ISG-2021-0123",
      },
      {
        id: "item-8",
        firstName: "Élodie",
        lastName: "MALANDA",
        diplomaTitle: "Master en Économie Appliquée",
        mention: "Très Bien",
        promotion: "2023",
        status: "PENDING",
        birthDate: "1998-04-18",
        matricule: "ISG-2020-0456",
      },
    ],
  },
  {
    id: "req-4",
    reference: "CERT-2024-004",
    universityId: "univ-5",
    universityName: "Institut Polytechnique de Brazzaville",
    submissionDate: "2024-01-16",
    totalStudents: 32,
    processedCount: 8,
    status: "PARTIAL",
    items: [
      {
        id: "item-9",
        firstName: "François",
        lastName: "NGOULOU",
        diplomaTitle: "Master en Génie Logiciel",
        mention: "Excellent",
        promotion: "2023",
        status: "APPROVED",
      },
      {
        id: "item-10",
        firstName: "Ghislaine",
        lastName: "OSSETE",
        diplomaTitle: "Licence en Informatique",
        mention: "Bien",
        promotion: "2023",
        status: "PENDING",
      },
    ],
  },
];

// ============================================================================
// REGISTRE NATIONAL
// ============================================================================

export const MOCK_REGISTRY_ENTRIES: RegistryEntry[] = [
  {
    id: "reg-1",
    serialNumber: "CG-2024-00001",
    studentName: "MABIALA Jean",
    universityName: "Université Marien Ngouabi",
    diplomaTitle: "Licence en Droit Public",
    filiere: "Sciences Juridiques",
    mention: "Bien",
    promotion: "2023",
    issueDate: "2024-01-15",
    year: "2024",
    status: "VALIDE",
  },
  {
    id: "reg-2",
    serialNumber: "CG-2024-00002",
    studentName: "BONGO Claire",
    universityName: "Université Denis Sassou Nguesso",
    diplomaTitle: "Doctorat en Médecine Générale",
    filiere: "Médecine",
    mention: "Très Bien",
    promotion: "2023",
    issueDate: "2024-01-14",
    year: "2024",
    status: "VALIDE",
  },
  {
    id: "reg-3",
    serialNumber: "CG-2023-04521",
    studentName: "MOUANDA Pierre",
    universityName: "Université Marien Ngouabi",
    diplomaTitle: "Master en Génie Logiciel",
    filiere: "Informatique",
    mention: "Très Bien",
    promotion: "2022",
    issueDate: "2023-07-20",
    year: "2023",
    status: "VALIDE",
  },
  {
    id: "reg-4",
    serialNumber: "CG-2023-03890",
    studentName: "NGOMA Félicité",
    universityName: "Institut Supérieur de Gestion",
    diplomaTitle: "Licence en Économie",
    filiere: "Sciences Économiques",
    mention: "Assez Bien",
    promotion: "2022",
    issueDate: "2023-06-15",
    year: "2023",
    status: "VALIDE",
  },
  {
    id: "reg-5",
    serialNumber: "CG-2022-02145",
    studentName: "OKANA Marc",
    universityName: "Université Libre du Congo",
    diplomaTitle: "Licence en Lettres",
    filiere: "Lettres Modernes",
    mention: "Passable",
    promotion: "2021",
    issueDate: "2022-08-10",
    year: "2022",
    status: "REVOQUE",
  },
  {
    id: "reg-6",
    serialNumber: "CG-2024-00003",
    studentName: "NGOULOU François",
    universityName: "Institut Polytechnique de Brazzaville",
    diplomaTitle: "Master en Génie Logiciel",
    filiere: "Informatique",
    mention: "Excellent",
    promotion: "2023",
    issueDate: "2024-01-16",
    year: "2024",
    status: "VALIDE",
  },
];

// ============================================================================
// ANNÉES DISPONIBLES
// ============================================================================

export const AVAILABLE_YEARS = ["2024", "2023", "2022", "2021", "2020"];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

export function calculateStats(
  registryData: RegistryEntry[],
  universities: University[]
): DashboardStats {
  const totalDiplomas = registryData.filter((r) => r.status === "VALIDE").length;
  const activeUniversities = universities.filter((u) => u.status === "ACTIVE").length;
  const pendingItems = MOCK_CERTIFICATION_REQUESTS.reduce((sum, req) => {
    return sum + req.items.filter((i) => i.status === "PENDING").length;
  }, 0);
  const rejectedItems = MOCK_CERTIFICATION_REQUESTS.reduce((sum, req) => {
    return sum + req.items.filter((i) => i.status === "REJECTED").length;
  }, 0);
  const totalProcessed = MOCK_CERTIFICATION_REQUESTS.reduce((sum, req) => {
    return sum + req.items.filter((i) => i.status !== "PENDING").length;
  }, 0);

  // Calcul du taux de rejet
  const rejectionRate = totalProcessed > 0 
    ? `${((rejectedItems / totalProcessed) * 100).toFixed(1)}%`
    : "0%";

  // Top filières
  const filiereCounts: Record<string, number> = {};
  registryData.forEach((entry) => {
    if (entry.status === "VALIDE") {
      filiereCounts[entry.filiere] = (filiereCounts[entry.filiere] || 0) + 1;
    }
  });
  const topFilieres = Object.entries(filiereCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: totalDiplomas > 0 ? Math.round((count / totalDiplomas) * 100) : 0,
    }));

  // Données du graphique par année
  const yearCounts: Record<string, number> = {};
  registryData.forEach((entry) => {
    if (entry.status === "VALIDE") {
      yearCounts[entry.year] = (yearCounts[entry.year] || 0) + 1;
    }
  });
  const maxCount = Math.max(...Object.values(yearCounts), 1);
  const chartData = AVAILABLE_YEARS.slice(0, 5)
    .reverse()
    .map((year) => ({
      year,
      count: yearCounts[year] || 0,
      heightPercent: yearCounts[year] ? (yearCounts[year] / maxCount) * 100 : 5,
    }));

  // Comptage public/privé
  const publicCount = universities.filter(
    (u) => u.type === "PUBLIC" && u.status === "ACTIVE"
  ).length;
  const privateCount = universities.filter(
    (u) => u.type === "PRIVE" && u.status === "ACTIVE"
  ).length;

  return {
    totalDiplomas,
    activeUniversities,
    pendingRequests: pendingItems,
    rejectionRate,
    topFilieres,
    chartData,
    publicCount,
    privateCount,
  };
}

