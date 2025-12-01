"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  showAllOption = true,
  allOptionLabel = "Tout afficher",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchroniser l'input avec la valeur selectionnee
  useEffect(() => {
    if (!isOpen) {
      if (value === "all") {
        setText("");
      } else {
        const selectedOption = options.find((o) => o.value === value);
        setText(selectedOption ? selectedOption.label : "");
      }
    }
  }, [value, isOpen, options]);

  // Fermer si on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(text.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`w-full px-3 py-2.5 bg-slate-50 border ${
          isOpen
            ? "border-blue-500 ring-1 ring-blue-500/20 bg-white"
            : "border-slate-200"
        } rounded-lg text-sm text-slate-700 flex items-center gap-2 transition-all cursor-text`}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.select(), 0);
          }
          inputRef.current?.focus();
        }}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${
              isOpen ? "text-blue-500" : "text-slate-400"
            }`}
          />
        )}

        <input
          ref={inputRef}
          type="text"
          className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-500 truncate font-medium"
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto custom-scrollbar">
          {showAllOption && (
            <div
              className="px-3 py-2 hover:bg-slate-50 text-sm cursor-pointer text-slate-500 italic transition-colors"
              onClick={() => handleSelect("all")}
            >
              {allOptionLabel}
            </div>
          )}
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-3 py-2 hover:bg-blue-50 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                value === opt.value
                  ? "bg-blue-50 text-blue-900 font-bold"
                  : "text-slate-700"
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="truncate">{opt.label}</span>
              {value === opt.value && (
                <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
              )}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-3 py-4 text-xs text-slate-400 text-center">
              Aucun résultat trouvé pour &quot;{text}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
