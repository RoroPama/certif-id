"use client";

import React, { useState } from "react";
import { Lock, FileBadge } from "lucide-react";
import LoginForm from "./LoginForm";
import OTPForm from "./OTPForm";

export default function AuthFormWrapper() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");

  const handleLoginSuccess = () => {
    setStep("otp");
  };

  const handleOTPSuccess = () => {
    // Ici, on peut ajouter une redirection ou une action de succès
    console.log("Authentification complète réussie");
  };

  const handleBackToLogin = () => {
    setStep("login");
    setEmail("");
  };

  const handleEmailCapture = (capturedEmail: string) => {
    setEmail(capturedEmail);
  };

  return (
    <div className="lg:w-1/2 relative z-10 flex flex-col justify-center items-center p-6 bg-slate-50/50">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-20 -right-20 opacity-[0.03] pointer-events-none">
          <FileBadge className="w-64 h-64 text-blue-900" />
        </div>

        <div className="bg-white rounded-t-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200/60 relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500"></div>

          <div className="p-8 sm:p-10">
            {/* HEADER DYNAMIQUE SELON L'ÉTAPE */}
            <div className="mb-8 text-center">
              {step === "login" ? (
                <>
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    Espace Sécurisé
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">
                    Veuillez vous identifier pour poursuivre
                  </p>
                </>
              ) : null}
            </div>

            {/* CONTENU DYNAMIQUE */}
            {step === "login" && (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onEmailCapture={handleEmailCapture}
              />
            )}

            {step === "otp" && (
              <OTPForm
                email={email}
                onOTPSuccess={handleOTPSuccess}
                onBackToLogin={handleBackToLogin}
              />
            )}
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                SSL Secure
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">
                Système opérationnel
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-white/80 backdrop-blur border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-bold text-blue-900">OTP DÉMO:</span>
              <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">
                123456
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
