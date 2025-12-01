/**
 * Types partagés pour le dashboard
 */

export type DiplomaTitel = { id: string; name: string };

export type Filiere = { id: string; name: string; diplomas: DiplomaTitel[] };

export type AcademicYear = { id: string; label: string; isCurrent: boolean };

export type StudentDraft = {
  id: string;
  firstName: string;
  lastName: string;
  sex: "M" | "F";
  yearId: string;
  filiereId: string;
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
};

export type RequestItemStatus = "PENDING" | "APPROVED" | "REJECTED";

export type RequestItem = {
  id: string;
  studentName: string;
  diplomaName: string;
  status: RequestItemStatus;
  rejectionReason?: string;
};

export type SubmittedRequest = {
  id: string;
  reference: string;
  submissionDate: string;
  academicYear: string;
  totalCount: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  items: RequestItem[];
};

export type DashboardTab =
  | "overview"
  | "institution"
  | "config"
  | "new-request"
  | "requests-history"
  | "registry";

