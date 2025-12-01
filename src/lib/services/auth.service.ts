/**
 * Service d'authentification
 * Gère tous les appels API liés à l'authentification
 */

import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  LoginDto,
  LoginResponseDto,
  VerifyOtpDto,
  User,
  RefreshTokenDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
} from "@/types/user";

export class AuthService {
  /**
   * Connexion avec email et password
   * @param credentials - Email et mot de passe
   * @returns Réponse de login avec tokens et user (ou requires2FA si 2FA activé)
   */
  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    return apiClient.post<LoginResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  /**
   * Vérification du code OTP pour compléter l'authentification 2FA
   * @param data - Email et code OTP
   * @returns Réponse de login avec tokens et user
   */
  async verifyOTP(data: VerifyOtpDto): Promise<LoginResponseDto> {
    return apiClient.post<LoginResponseDto>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
  }

  /**
   * Renvoyer un code OTP
   * @param email - Email de l'utilisateur
   * @returns Message de confirmation
   */
  async resendOTP(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.RESEND_OTP, {
      email,
    });
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   * @returns Données de l'utilisateur
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Rafraîchir les tokens d'authentification
   * @param refreshToken - Token de rafraîchissement
   * @returns Nouveaux tokens (accessToken et refreshToken)
   */
  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return apiClient.post<{ accessToken: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenDto
    );
  }

  /**
   * Demander une réinitialisation de mot de passe
   * @param data - Email de l'utilisateur
   * @returns Message de confirmation
   */
  async requestPasswordReset(
    data: RequestResetPasswordDto
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.REQUEST_RESET_PASSWORD,
      data
    );
  }

  /**
   * Réinitialiser le mot de passe avec un token
   * @param data - Token et nouveau mot de passe
   * @returns Message de confirmation
   */
  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
  }

  /**
   * Activer la 2FA pour l'utilisateur connecté
   * @returns Message de confirmation
   */
  async enable2FA(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.ENABLE_2FA);
  }

  /**
   * Désactiver la 2FA pour l'utilisateur connecté
   * @returns Message de confirmation
   */
  async disable2FA(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.DISABLE_2FA);
  }

  /**
   * Déconnexion (appel API si nécessaire)
   * Note: Pour l'instant, la déconnexion est gérée côté client
   * mais on peut ajouter un appel API pour invalider le token côté serveur
   */
  async logout(): Promise<void> {
    // Si le backend a un endpoint de logout, on peut l'appeler ici
    // Pour l'instant, on ne fait rien côté serveur
    // return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }
}

// Export d'une instance singleton
export const authService = new AuthService();
