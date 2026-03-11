"use client";

import { useState } from "react";

interface PromptBlockProps {
  label: string;
  text: string;
}

export function PromptBlock({ label, text }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-50 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-cream-200 bg-white">
        <span className="text-xs font-semibold text-earth-600 uppercase tracking-wide">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-medium text-spice hover:text-spice-dark transition-colors flex items-center gap-1.5"
          aria-label={`Kopiér prompt: ${label}`}
        >
          {copied ? (
            <>
              <CheckIcon /> Kopieret
            </>
          ) : (
            <>
              <CopyIcon /> Kopiér
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-4 text-sm text-earth-800 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">
        {text}
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
