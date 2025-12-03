/**
 * Service de gestion de l'upload de fichiers
 * Gère l'upload de fichiers PDF via l'API backend
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface UploadResponse {
  url: string;
}

export class UploadService {
  /**
   * Uploader un fichier PDF via l'API backend
   * @param file - Fichier PDF à uploader
   * @returns URL du fichier uploadé
   */
  async uploadPdf(file: File): Promise<string> {
    try {
      // Vérifier que le fichier est un PDF
      if (file.type !== "application/pdf") {
        throw new Error("Le fichier doit être au format PDF");
      }

      // Vérifier la taille du fichier (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(
          "Le fichier est trop volumineux. Taille maximale: 10MB"
        );
      }

      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append("file", file);

      // Uploader via l'API backend
      // Note: axios gère automatiquement le Content-Type pour FormData
      // Ne pas définir Content-Type manuellement, laisser axios le faire
      const response = await apiClient.post<UploadResponse>(
        API_ENDPOINTS.DOCUMENTS.UPLOAD,
        formData
      );

      return response.url;
    } catch (error) {
      console.error("Erreur lors de l'upload du PDF:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'upload du fichier"
      );
    }
  }

  /**
   * Uploader plusieurs fichiers PDF
   * @param files - Tableau de fichiers PDF à uploader
   * @returns Tableau des URLs des fichiers uploadés
   */
  async uploadMultiplePdfs(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadPdf(file));
    return Promise.all(uploadPromises);
  }
}

// Export d'une instance singleton
export const uploadService = new UploadService();
