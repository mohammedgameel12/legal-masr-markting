import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Languages,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import "./Header.css";
import logo from "../assets/logo.png";
import logoDark from "../assets/logo-dark.png";

const THEMES = ["system", "light", "dark"];

const ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "system") {
    root.removeAttribute("data-theme");
    root.classList.toggle(
      "dark",
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  } else {
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
  }
}

export default function Header() {
  const { t, i18n } = useTranslation("Header");

  const [open, setOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const themeMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Keep the first server and client render identical, then restore the user's preference.
  const [theme, setTheme] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (
      savedTheme === "system" ||
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const lang = i18n.resolvedLanguage || "en";

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target)
      ) {
        setThemeMenuOpen(false);
      }

      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectTheme = (nextTheme) => {
    setTheme(nextTheme);
    setThemeMenuOpen(false);
  };

  const selectLanguage = (language) => {
    i18n.changeLanguage(language);
    setLanguageMenuOpen(false);
  };

  const ThemeIcon = ICONS[theme];
  const links = ["how-to-use", "feedback", "download"];

  useEffect(() => {
    applyTheme(theme);

    if (typeof window !== "undefined")
      window.localStorage.setItem("theme", theme);

    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const sync = () => {
      setResolvedTheme(mq.matches ? "dark" : "light");
      applyTheme("system");
    };

    sync();

    mq.addEventListener("change", sync);

    return () => mq.removeEventListener("change", sync);
  }, [theme]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden="true">
            <img
              src={(resolvedTheme === "dark" ? logoDark : logo).src}
              alt="Logo"
            />
          </span>

          {t("brand")}
        </a>

        <nav
          className={`site-header__nav ${open ? "is-open" : ""}`}
          aria-label={t("navLabel")}
        >
          {links.map((k) => (
            <a key={k} href={`/${k}`} onClick={() => setOpen(false)}>
              {t(`nav.${k}`)}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          {/* Theme */}
          <div className="site-header__dropdown" ref={themeMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setThemeMenuOpen((value) => !value);
                setLanguageMenuOpen(false);
              }}
              aria-label={t("theme.label")}
              aria-expanded={themeMenuOpen}
              title={t(`theme.${theme}`)}
            >
              <ThemeIcon size={18} />
            </Button>

            {themeMenuOpen && (
              <div className="site-header__dropdown-menu">
                {THEMES.map((item) => {
                  const Icon = ICONS[item];

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`site-header__dropdown-item ${
                        theme === item ? "is-active" : ""
                      }`}
                      onClick={() => selectTheme(item)}
                    >
                      <Icon size={16} />

                      <span>{t(`theme.${item}`)}</span>

                      {theme === item && (
                        <Check
                          size={16}
                          className="site-header__dropdown-check"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language */}
          <div className="site-header__dropdown" ref={languageMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLanguageMenuOpen((value) => !value);
                setThemeMenuOpen(false);
              }}
              aria-label={t("language.label")}
              aria-expanded={languageMenuOpen}
            >
              <Languages size={16} />

              <span className="site-header__language-text site-header__language-text--full">
                {i18n.resolvedLanguage === "ar" ? "العربية" : "English"}
              </span>

              <span className="site-header__language-text site-header__language-text--short">
                {i18n.resolvedLanguage === "ar" ? "EN" : "ع"}
              </span>

              <ChevronDown
                size={14}
                className={`site-header__dropdown-chevron ${
                  languageMenuOpen ? "is-open" : ""
                }`}
              />
            </Button>

            {languageMenuOpen && (
              <div className="site-header__dropdown-menu site-header__language-menu">
                <button
                  type="button"
                  className={`site-header__dropdown-item ${
                    i18n.resolvedLanguage === "en" ? "is-active" : ""
                  }`}
                  onClick={() => selectLanguage("en")}
                >
                  <span>English</span>

                  {i18n.resolvedLanguage === "en" && (
                    <Check size={16} className="site-header__dropdown-check" />
                  )}
                </button>

                <button
                  type="button"
                  className={`site-header__dropdown-item ${
                    i18n.resolvedLanguage === "ar" ? "is-active" : ""
                  }`}
                  onClick={() => selectLanguage("ar")}
                >
                  <span>العربية</span>

                  {i18n.resolvedLanguage === "ar" && (
                    <Check size={16} className="site-header__dropdown-check" />
                  )}
                </button>
              </div>
            )}
          </div>

          <a className={buttonVariants({size: "sm"}) + " site-header__cta"} href="/#download">{t("download")}</a>

          <Button
            variant="ghost"
            size="icon"
            className="site-header__burger"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={t("menu")}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
