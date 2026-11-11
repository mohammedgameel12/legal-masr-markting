import { useTranslation } from "react-i18next";
import {
  Download,
  Briefcase,
  Users,
  Wallet,
  Archive,
  ShieldCheck,
  CalendarDays,
  FileText,
  ArrowRight,
  Check,
  Lock,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroBackground from "../components/HeroBackground";
import "./Home.css";

const FEATURE_ICONS = [Briefcase, CalendarDays, Users, Wallet, FileText, Archive];

export default function Home() {
  const { t } = useTranslation("Home");

  const features = t("features.items", { returnObjects: true });
  const steps = t("guide.steps", { returnObjects: true });
  const localPoints = t("local.points", { returnObjects: true });

  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        <HeroBackground />

        <div className="home-hero__glow home-hero__glow--one" />
        <div className="home-hero__glow home-hero__glow--two" />

        <div className="home-hero__grid">
          <div className="home-hero__copy">
            {/* <Badge className="home-hero__badge hero-reveal hero-reveal--1">
              <Sparkles size={13} />
              {t("hero.badge")}
            </Badge> */}

            <h1 className="hero-reveal hero-reveal--2">{t("hero.title")}</h1>

            <p className="home-hero__subtitle hero-reveal hero-reveal--3">
              {t("hero.subtitle")}
            </p>

            <div className="home-hero__actions hero-reveal hero-reveal--4">
              <a className={buttonVariants({size: "lg"})} href="/download">
                  <Download size={18} />
                  {t("hero.primary")}
                  <ArrowRight size={17} />
                </a>

              <a className={buttonVariants({variant: "ghost", size: "lg"})} href="/how-to-use">
                  {t("hero.secondary")}
                  <ArrowRight size={17} />
                </a>
            </div>

            <div className="home-hero__trust hero-reveal hero-reveal--5">
              <div className="home-hero__trust-icon">
                <ShieldCheck size={17} />
              </div>

              <span>{t("hero.note")}</span>
            </div>
          </div>

          {/* Product visual */}
          <div className="home-product hero-product-reveal">
            <div className="home-product__glow" />

            <div className="home-product__window">
              <div className="home-product__topbar">
                <div className="home-product__dots">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="home-product__address">Legal Masr</div>

                <div />
              </div>

              <div className="home-product__body">
                <div className="home-product__sidebar">
                  <div className="home-product__sidebar-header">
                    <FileText size={14} />
                    <span>{t("hero.mock.source")}</span>
                  </div>

                  <div className="home-product__source">
                    <strong>{t("hero.mock.sourceText")}</strong>
                    <span>{t("hero.mock.ref")}</span>
                  </div>

                  <div className="home-product__source">
                    <strong>{t("hero.mock.commentary")}</strong>
                    <span>{t("hero.mock.commentaryText")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="home-section home-features-section reveal"
      >
        <div className="home-section__heading">
          <Badge variant="secondary">{t("features.title")}</Badge>

          <h2>{t("features.lead")}</h2>
        </div>

        <div className="home-bento">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index];

            return (
              <article
                key={index}
                className={`home-bento__item reveal reveal--stagger-${Math.min(
                  index + 1,
                  6,
                )} home-bento__item--${index + 1}`}
              >
                <div className="home-bento__icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= GUIDE ================= */}
      <section id="guide" className="home-workflow">
        <div className="home-workflow__header reveal">
          <Badge variant="secondary">{t("guide.title")}</Badge>

          <h2>{t("guide.lead")}</h2>
        </div>

        <div className="home-workflow__steps">
          {steps.map((step, index) => (
            <div
              className={`home-workflow__step reveal reveal--stagger-${Math.min(
                index + 1,
                6,
              )}`}
              key={index}
            >
              <div className="home-workflow__number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>

              {index !== steps.length - 1 && (
                <div className="home-workflow__line" />
              )}
            </div>
          ))}
        </div>

        <div className="reveal reveal--stagger-4">
          <a className={buttonVariants({variant: "outline"})} href="/how-to-use">
              {t("guide.cta")}
              <ArrowRight size={17} />
            </a>
        </div>
      </section>

      {/* ================= LOCAL FIRST ================= */}
      <section className="home-privacy reveal">
        <div className="home-privacy__icon">
          <ShieldCheck size={26} />
        </div>

        <div className="home-privacy__content">
          <Badge variant="secondary">
            <Lock size={13} />
            {t("local.badge")}
          </Badge>

          <h2>{t("local.title")}</h2>
          <p>{t("local.desc")}</p>
        </div>

        <div className="home-privacy__checklist">
          {localPoints.map((point, index) => (
            <div key={index}>
              <Check size={16} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DOWNLOAD ================= */}
      <section id="download" className="home-download reveal">
        <HeroBackground />

        <div className="home-download__glow" />

        <div className="home-download__content">
          <Badge>
            <Download size={13} />
            {t("download.title")}
          </Badge>

          <h2>{t("download.desc")}</h2>

          <div className="home-download__buttons">
            <a href="/download" className="home-download__button rounded-4xl">
              <Download size={18} />
              {t("download.cta")}
            </a>
          </div>

          <p>{t("download.note")}</p>
        </div>
      </section>
    </div>
  );
}
