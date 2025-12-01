"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onEmailCapture: (email: string) => void;
}

export default function LoginForm({
  onLoginSuccess,
  onEmailCapture,
}: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      // Si 2FA est requis, passer à l'étape OTP
      if (response.requires2FA) {
        onEmailCapture(email.toLowerCase());
        onLoginSuccess();
      }
      // Sinon, la redirection est gérée automatiquement par AuthProvider
    } catch (err: any) {
      // Gérer les erreurs de l'API
      const errorMessage =
        err?.message || "Identifiants non reconnus par le système central.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300"
    >
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
          Identifiant Académique
        </label>
        <div className="relative group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3.5 pl-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all outline-none"
            placeholder="matricule@universite.cg"
            required
          />
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center pl-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Mot de passe
          </label>
          <a
            href="#"
            className="text-xs font-semibold text-blue-900 hover:text-amber-600 transition-colors"
          >
            Oublié ?
          </a>
        </div>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3.5 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all outline-none"
            placeholder="••••••••••"
            required
          />
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-800 px-4 py-3 rounded-md text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-semibold block">Erreur</span>
            <span className="text-red-700/80">{error}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-950 hover:bg-blue-900 text-white font-medium py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>Accéder au portail</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
