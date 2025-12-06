/**
 * Hook personnalisé pour la logique de création de nouvelle demande
 */

import { useState, useMemo } from "react";
import { requestsService } from "@/lib/services/requests.service";
import { uploadService } from "@/lib/services/upload.service";
import type { StudentDraft, DiplomeWithParcours, AcademicYear } from "../types";
import type { DemandeEntity } from "@/lib/services/requests.service";

interface UseNewRequestProps {
  diplomes: DiplomeWithParcours[];
  foundationYear: number;
  onSubmitSuccess: () => void;
}

export function useNewRequest({ diplomes, foundationYear, onSubmitSuccess }: UseNewRequestProps) {
  const [draftList, setDraftList] = useState<StudentDraft[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<StudentDraft>>({
    sex: "M",
    mention: "Passable",
    pdfFile: null,
    fileName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      !currentEntry.diplomaId ||
      !currentEntry.yearId ||
      !currentEntry.pdfFile
    ) {
      alert("Veuillez remplir tous les champs obligatoires, y compris le fichier PDF.");
      return;
    }

    // Vérifier que si le diplôme a des parcours, un parcours doit être sélectionné
    const selectedDiplome = diplomes.find((d) => d.id === currentEntry.diplomaId);
    if (selectedDiplome && selectedDiplome.parcours.length > 0 && !currentEntry.parcoursId) {
      alert("Veuillez sélectionner un parcours pour ce diplôme.");
      return;
    }
    
    const newDraft: StudentDraft = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: currentEntry.firstName!,
      lastName: currentEntry.lastName!,
      sex: currentEntry.sex as "M" | "F",
      yearId: currentEntry.yearId!,
      parcoursId: currentEntry.parcoursId, // Optionnel
      diplomaId: currentEntry.diplomaId!,
      diplomaName: selectedDiplome ? selectedDiplome.name : "",
      mention: currentEntry.mention || "Passable",
      pdfFile: currentEntry.pdfFile || null,
      fileName: currentEntry.fileName || "",
    };
    setDraftList([...draftList, newDraft]);
    setCurrentEntry({
      sex: "M",
      mention: "Passable",
      pdfFile: null,
      fileName: "",
      firstName: "",
      lastName: "",
    });
  };

  const handleRemoveDraft = (id: string) => {
    setDraftList(draftList.filter((d) => d.id !== id));
  };

  const handleSubmit = async () => {
    if (draftList.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Uploader tous les PDFs et préparer les documents
      const documentPromises = draftList.map(async (draft) => {
        // 1. Uploader le PDF
        if (!draft.pdfFile) {
          throw new Error(
            `Fichier PDF manquant pour ${draft.firstName} ${draft.lastName}`
          );
        }

        const pdfUrl = await uploadService.uploadPdf(draft.pdfFile);

        // 2. Trouver le type de document correspondant au diplôme
        // Le diplomaId est l'ID du type de document (mappé depuis les types de documents autorisés)
        const documentTypeId = draft.diplomaId;

        // Validation : vérifier que documentTypeId est un UUID valide
        if (
          !documentTypeId ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            documentTypeId
          )
        ) {
          throw new Error(
            `ID de type de document invalide pour ${draft.firstName} ${draft.lastName}. Veuillez sélectionner un type de document valide.`
          );
        }

        // 3. Retourner les données du document
        // Inclure parcoursId seulement si c'est un UUID valide (pas "autres")
        const parcoursId = draft.parcoursId && 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(draft.parcoursId)
          ? draft.parcoursId
          : undefined;

        return {
          documentTypeId,
          nomBeneficiaire: draft.firstName,
          prenomBeneficiaire: draft.lastName,
          dateEmission: new Date().toISOString().split("T")[0], // Date d'aujourd'hui
          pdfOriginalUrl: pdfUrl,
          matricule: draft.yearId, // Utiliser l'année comme matricule temporaire
          ...(parcoursId && { parcoursId }), // Inclure parcoursId seulement s'il est valide
        };
      });

      // Attendre que tous les uploads soient terminés
      const documents = await Promise.all(documentPromises);

      // Créer une seule demande avec tous les documents
      const demande = await requestsService.createRequest({
        documents,
        note: `Demande groupée - ${draftList.length} document(s)`,
      });

      // Succès - rediriger
      setDraftList([]);
      onSubmitSuccess();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la soumission"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    draftList,
    currentEntry,
    years,
    isSubmitting,
    error,
    setCurrentEntry,
    handleAddDraft,
    handleRemoveDraft,
    handleSubmit,
  };
}

