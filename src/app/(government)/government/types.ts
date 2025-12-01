/**
 * Types pour le module Government (Ministère)
 */

// Statuts
export type UniversityStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
export type CertificationRequestStatus = "PENDING" | "PARTIAL" | "COMPLETED";
export type CertificationItemStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RegistryEntryStatus = "VALIDE" | "REVOQUE";

// Filière
export interface Filiere {
  id: string;
  name: string;
  diplomas: string[];
}

// Université/Établissement
export interface University {
  id: string;
  name: string;
  type: "PUBLIC" | "PRIVE";
  rector: string;
  email: string;
  city: string;
  status: UniversityStatus;
  diplomaCount: number;
  lastActivity: string;
  filieres: Filiere[];
  phone?: string;
  address?: string;
  description?: string;
}

// Élément étudiant dans une demande de certification
export interface StudentItem {
  id: string;
  firstName: string;
  lastName: string;
  diplomaTitle: string;
  mention: string;
  promotion: string;
  status: CertificationItemStatus;
  rejectionReason?: string;
  birthDate?: string;
  matricule?: string;
  transcriptFile?: string;
}

// Demande de certification (bordereau)
export interface CertificationRequest {
  id: string;
  reference: string;
  universityId: string;
  universityName: string;
  submissionDate: string;
  totalStudents: number;
  processedCount: number;
  status: CertificationRequestStatus;
  items: StudentItem[];
}

// Entrée dans le registre national
export interface RegistryEntry {
  id: string;
  serialNumber: string;
  studentName: string;
  universityName: string;
  diplomaTitle: string;
  filiere: string;
  mention: string;
  promotion: string;
  issueDate: string;
  year: string;
  status: RegistryEntryStatus;
}

// Stats du dashboard
export interface DashboardStats {
  totalDiplomas: number;
  activeUniversities: number;
  pendingRequests: number;
  rejectionRate: string;
  topFilieres: { name: string; count: number; percent: number }[];
  chartData: { year: string; count: number; heightPercent: number }[];
  publicCount: number;
  privateCount: number;
}

// Formulaire création université
export interface UniversityFormData {
  name?: string;
  type?: "PUBLIC" | "PRIVE";
  rector?: string;
  email?: string;
  city?: string;
  phone?: string;
  address?: string;
  description?: string;
  filieres?: Filiere[];
}

