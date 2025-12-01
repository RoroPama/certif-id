/**
 * Types pour les utilisateurs
 * Correspond aux types du backend NestJS
 */

export enum UserType {
  SUPPORT = "SUPPORT",
  ETABLISSEMENT = "ETABLISSEMENT",
  ENTREPRISE = "ENTREPRISE",
  MINISTERE = "MINISTERE",
}

export interface Permission {
  id: string;
  nom: string;
  description?: string;
}

export interface Role {
  id: string;
  nom: string;
  description?: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  type: UserType;
  roleId: string;
  role: Role;
  permissions: Permission[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  requires2FA: boolean;
  message?: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RequestResetPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface RegisterDto {}

