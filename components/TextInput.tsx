"use client";

import { useState, useRef } from "react";

interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: string;
}

export default function TextInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
}: TextInputProps) {
  const charCount = value.length;
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setIsExtracting(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to extract text");
        }
        
        const data = await res.json();
        onChange(data.text);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setIsExtracting(false);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-sm font-semibold text-slate-300"
        >
          <span className="text-lg">{icon}</span>
          {label}
        </label>
        
        <input
          type="file"
          accept=".txt,.pdf,image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isExtracting}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors disabled:opacity-50"
        >
          {isExtracting ? "Extracting..." : "Upload File"}
        </button>
      </div>

      <div className="relative flex-1 group">
        <textarea
          id={id}
          name={id}
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-[240px] md:min-h-[320px] resize-y
            bg-slate-800/50 backdrop-blur-sm
            border border-slate-700/60
            rounded-2xl p-4 text-sm text-slate-200
            placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            transition-all duration-200
            scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
        />
        {/* Character count */}
        <div className="absolute bottom-3 right-4 text-xs text-slate-500 tabular-nums pointer-events-none">
          {charCount.toLocaleString()} chars
        </div>
        
        {isExtracting && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
