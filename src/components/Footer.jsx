import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Footer.css";
import logo from "../assets/logo.png";
import logoDark from "../assets/logo-dark.png";

export default function Footer() {
  const { t } = useTranslation("Footer");

  // Match the server-rendered value; update to the saved preference after hydration.
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme =
        (typeof window !== "undefined"
          ? window.localStorage.getItem("theme")
          : null) || "system";

      if (savedTheme === "system") {
        setResolvedTheme(
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        );
      } else {
        setResolvedTheme(savedTheme);
      }
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, []);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__about">
          <div className="site-footer__about-cont">
            <img
              className="site-footer__logo"
              src={(resolvedTheme === "dark" ? logoDark : logo).src}
              alt={t("brand")}
            />

            <strong className="site-footer__brand">{t("brand")}</strong>
          </div>

          <p>{t("tagline")}</p>
        </div>

        <nav className="site-footer__col" aria-label={t("product.title")}>
          <h2>{t("product.title")}</h2>

          <a href="/#features">{t("product.features")}</a>

          <a href="/how-to-use">{t("product.guide")}</a>

          <a href="/download">{t("product.download")}</a>
        </nav>

        <nav className="site-footer__col" aria-label={t("company.title")}>
          <h2>{t("company.title")}</h2>

          <a href="/#features">{t("product.features")}</a>

          <a href="/feedback">{t("company.contact")}</a>
        </nav>
      </div>

      <p className="site-footer__legal">
        © {new Date().getFullYear()} {t("brand")}. {t("rights")}
      </p>
    </footer>
  );
}
