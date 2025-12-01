"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LoginDto,
  LoginResponseDto,
  VerifyOtpDto,
  UserType,
} from "@/types/user";
import { authService } from "@/lib/services/auth.service";
import { INSTITUTION_ROUTES, GOVERNMENT_ROUTES } from "@/lib/utils/constants";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<LoginResponseDto>;
  verifyOTP: (data: VerifyOtpDto) => Promise<LoginResponseDto>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fonction pour nettoyer l'authentification
  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Fonction pour sauvegarder l'authentification
  const saveAuth = useCallback((response: LoginResponseDto) => {
    if (response.accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      setUser(response.user);
    }
  }, []);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(AUTH_TOKEN_KEY);

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [clearAuth]);

  // Fonction de redirection selon le type d'utilisateur
  const redirectUser = useCallback(
    (userType: UserType) => {
      if (userType === UserType.ETABLISSEMENT) {
        router.push(INSTITUTION_ROUTES.ROOT);
      } else if (userType === UserType.MINISTERE) {
        router.push(GOVERNMENT_ROUTES.ROOT);
      }
      // Pour SUPPORT et ENTREPRISE, on peut ajouter des routes plus tard
    },
    [router]
  );

  // Fonction de login
  const login = useCallback(
    async (credentials: LoginDto): Promise<LoginResponseDto> => {
      try {
        const response = await authService.login(credentials);

        // Si pas de 2FA requis, sauvegarder directement et rediriger
        if (!response.requires2FA && response.user) {
          saveAuth(response);
          redirectUser(response.user.type);
        }

        return response;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [saveAuth, redirectUser]
  );

  // Fonction de vérification OTP
  const verifyOTP = useCallback(
    async (data: VerifyOtpDto): Promise<LoginResponseDto> => {
      try {
        const response = await authService.verifyOTP(data);

        if (response.user) {
          saveAuth(response);
          redirectUser(response.user.type);
        }

        return response;
      } catch (error) {
        console.error("OTP verification error:", error);
        throw error;
      }
    },
    [saveAuth, redirectUser]
  );

  // Fonction de logout
  const logout = useCallback(() => {
    clearAuth();
    router.push("/login");
  }, [clearAuth, router]);

  // Fonction pour rafraîchir les données utilisateur
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        clearAuth();
        return;
      }

      const userData = await authService.getCurrentUser();
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
      clearAuth();
    }
  }, [clearAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    verifyOTP,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
