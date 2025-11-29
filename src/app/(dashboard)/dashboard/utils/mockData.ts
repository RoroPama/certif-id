/**
 * Générateurs de données mockées pour le dashboard
 */

import type {
  ApprovedDiploma,
  SubmittedRequest,
  RequestItem,
  RequestItemStatus,
} from "../types";

export const generateMockRegistry = (): ApprovedDiploma[] => {
  const names = [
    "MABIALA",
    "NGUESSO",
    "OKEMBA",
    "IBARA",
    "LOUBASSOU",
    "MAKOSSO",
    "TCHIBINDA",
    "SASSOU",
    "MILONGO",
    "KOLA",
    "BOUKA",
    "GOMA",
  ];
  const firstNames = [
    "Jean",
    "Sarah",
    "Michel",
    "Grace",
    "Paul",
    "Esther",
    "David",
    "Ruth",
    "Moise",
    "Divine",
  ];
  const diplomas = [
    "Licence en Droit Public",
    "Master en Informatique",
    "Licence en Économie",
    "Master en Gestion",
    "Licence en Sociologie",
  ];

  return Array.from({ length: 45 }).map((_, i) => ({
    id: `D-2024-${100 + i}`,
    studentName: `${names[Math.floor(Math.random() * names.length)]} ${
      firstNames[Math.floor(Math.random() * firstNames.length)]
    }`,
    diplomaTitle: diplomas[Math.floor(Math.random() * diplomas.length)],
    year: Math.random() > 0.3 ? "2023-2024" : "2022-2023",
    issueDate: `1${Math.floor(Math.random() * 9)}/06/2024`,
    serialNumber: `UMNG-24-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`,
    status: Math.random() > 0.05 ? "active" : "revoked",
    mention: Math.random() > 0.5 ? "Bien" : "Assez Bien",
    filiere: "Sciences Juridiques et Administratives",
  }));
};

export const generateMockHistory = (): SubmittedRequest[] => {
  return Array.from({ length: 18 }).map((_, i) => {
    const total = Math.floor(Math.random() * 20) + 5;
    const items: RequestItem[] = [];

    let approved = 0;
    let rejected = 0;
    let pending = 0;

    const requestState = Math.random();

    for (let j = 0; j < total; j++) {
      let status: RequestItemStatus = "PENDING";
      let reason = undefined;

      if (requestState > 0.6) {
        if (Math.random() > 0.1) status = "APPROVED";
        else {
          status = "REJECTED";
          reason = "Scan illisible";
        }
      } else if (requestState > 0.3) {
        status = "PENDING";
      } else {
        if (Math.random() > 0.5) status = "APPROVED";
        else {
          status = "REJECTED";
          reason = "Non-conformité académique";
        }
      }

      if (status === "APPROVED") approved++;
      if (status === "REJECTED") rejected++;
      if (status === "PENDING") pending++;

      items.push({
        id: `ITM-${i}-${j}`,
        studentName: `Étudiant ${j + 1}`,
        diplomaName: "Licence en Droit",
        status,
        rejectionReason: reason,
      });
    }

    return {
      id: `REQ-${i}`,
      reference: `BORD-2024-${800 - i}`,
      submissionDate: `${Math.floor(Math.random() * 28) + 1}/11/2024`,
      academicYear: Math.random() > 0.4 ? "2023-2024" : "2022-2023",
      totalCount: total,
      approvedCount: approved,
      rejectedCount: rejected,
      pendingCount: pending,
      items,
    };
  });
};
