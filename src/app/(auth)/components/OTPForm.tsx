"use client";

import React, { useState } from "react";
import { Smartphone, Shield, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { authService } from "@/lib/services/auth.service";
import { APP_CONFIG } from "@/lib/utils/constants";
import { MESSAGES } from "@/lib/utils/messages";

interface OTPFormProps {
  email: string;
  onOTPSuccess: () => void;
  onBackToLogin: () => void;
}

export default function OTPForm({
  email,
  onOTPSuccess,
  onBackToLogin,
}: OTPFormProps) {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

  const { otp: otpMessages } = MESSAGES.auth;

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResendSuccess(false);
    setIsLoading(true);

    try {
      await verifyOTP({ email, otp });
      // La redirection est gérée automatiquement par AuthProvider
      onOTPSuccess();
    } catch (err: any) {
      // Gérer les erreurs de l'API
      const errorMessage =
        err?.message || otpMessages.incorrectCode || "Code OTP invalide";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setResendSuccess(false);
    setIsLoading(true);

    try {
      await authService.resendOTP(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'envoi du code OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-900 animate-in zoom-in duration-300">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900">
          {otpMessages.title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          {otpMessages.description} <br />
          <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50/80 backdrop-blur border border-red-100 text-red-800 px-4 py-3 rounded-md text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-semibold block">
              {MESSAGES.errors.generic.split(" ")[0]}
            </span>
            <span className="text-red-700/80">{error}</span>
          </div>
        </div>
      )}

      {resendSuccess && (
        <div className="mb-6 bg-green-50/80 backdrop-blur border border-green-100 text-green-800 px-4 py-3 rounded-md text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <div>
            <span className="font-semibold block">Succès</span>
            <span className="text-green-700/80">
              Code OTP renvoyé avec succès. Vérifiez votre email.
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleOtpSubmit}
        className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
            {otpMessages.codeLabel}
          </label>
          <div className="relative group">
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, APP_CONFIG.OTP_LENGTH)
                )
              }
              className="block w-full px-4 py-3.5 text-center tracking-[0.5em] text-xl font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:tracking-normal placeholder:text-sm placeholder:font-sans placeholder:text-slate-400 focus:bg-white focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all outline-none"
              placeholder={otpMessages.codePlaceholder}
              required
              autoFocus
            />
          </div>
          <p className="text-xs text-center text-slate-400 mt-2">
            {otpMessages.codeExpiry}{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-blue-900 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpMessages.resendCode}
            </button>
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-950 hover:bg-blue-900 text-white font-medium py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{otpMessages.submitButton}</span>
              <Shield className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-slate-500 hover:text-slate-800 text-sm font-medium py-2 flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {otpMessages.backToLogin}
        </button>
      </form>
    </>
  );
}
