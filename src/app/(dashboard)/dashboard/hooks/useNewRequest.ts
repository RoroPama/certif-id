/**
 * Hook personnalisé pour la logique de création de nouvelle demande
 */

import { useState, useMemo } from "react";
import type { StudentDraft, Filiere, AcademicYear, SubmittedRequest } from "../types";

interface UseNewRequestProps {
  filieres: Filiere[];
  foundationYear: number;
  onSubmitSuccess: (request: SubmittedRequest) => void;
}

export function useNewRequest({ filieres, foundationYear, onSubmitSuccess }: UseNewRequestProps) {
  const [draftList, setDraftList] = useState<StudentDraft[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<StudentDraft>>({
    sex: "M",
    mention: "Passable",
  });

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

  const handleAddDraft = () => {
    if (
      !currentEntry.firstName ||
      !currentEntry.lastName ||
      !currentEntry.filiereId ||
      !currentEntry.yearId
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const filiere = filieres.find((f) => f.id === currentEntry.filiereId);
    const newDraft: StudentDraft = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: currentEntry.firstName!,
      lastName: currentEntry.lastName!,
      sex: currentEntry.sex as "M" | "F",
      yearId: currentEntry.yearId!,
      filiereId: currentEntry.filiereId!,
      diplomaName: filiere ? filiere.diplomaName : "",
      mention: currentEntry.mention || "Passable",
      file: currentEntry.file || null,
    };
    setDraftList([...draftList, newDraft]);
    setCurrentEntry({
      ...currentEntry,
      firstName: "",
      lastName: "",
      file: null,
    });
  };

  const handleRemoveDraft = (id: string) => {
    setDraftList(draftList.filter((d) => d.id !== id));
  };

  const handleSubmit = () => {
    if (draftList.length === 0) return;

    const total = draftList.length;
    const items = draftList.map((d, i) => ({
      id: `NEW-${i}`,
      studentName: `${d.firstName} ${d.lastName}`,
      diplomaName: d.diplomaName,
      status: "PENDING" as const,
    }));

    const newRequest: SubmittedRequest = {
      id: Math.random().toString(),
      reference: `BORD-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      submissionDate: new Date().toLocaleDateString("fr-FR"),
      academicYear:
        years.find((y) => y.id === draftList[0]?.yearId)?.label || "2023-2024",
      totalCount: total,
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: total,
      items,
    };

    onSubmitSuccess(newRequest);
    setDraftList([]);
  };

  return {
    draftList,
    currentEntry,
    years,
    setCurrentEntry,
    handleAddDraft,
    handleRemoveDraft,
    handleSubmit,
  };
}

