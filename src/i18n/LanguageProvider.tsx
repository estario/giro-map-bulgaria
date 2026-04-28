import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { T, LANG_LABELS, LANG_FULL, type Lang } from "./translations";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof T)[Lang];
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "giro-lang";

function detectInitial(): Lang {
  if (typeof window === "undefined") return "bg";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "bg" || saved === "en" || saved === "it") return saved;
  const nav = window.navigator.language?.slice(0, 2).toLowerCase();
  if (nav === "en") return "en";
  if (nav === "it") return "it";
  return "bg";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bg");

  useEffect(() => {
    setLangState(detectInitial());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useT();
  const langs: Lang[] = ["bg", "en", "it"];
  return (
    <div
      className={`inline-flex rounded-full bg-white/15 backdrop-blur p-1 ring-1 ring-white/30 text-xs font-bold ${className}`}
      role="group"
      aria-label="Language"
    >
      {langs.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={LANG_FULL[l]}
            title={LANG_FULL[l]}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              active
                ? "bg-white text-foreground shadow"
                : "text-primary-foreground/90 hover:text-primary-foreground"
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}