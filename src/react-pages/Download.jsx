import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Check,
  Copy,
  Download as DownloadIcon,
  Info,
  Monitor,
  Package,
  Terminal,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import "./Download.css";

import { downloads as DOWNLOADS, release, fileUrl as releaseFileUrl } from "../lib/downloads";
const VERSION = release.version;
const RELEASE_DATE = release.date;
const fileUrl = file => releaseFileUrl(file, import.meta.env.PUBLIC_DOWNLOAD_BASE_URL);

const GROUP_ORDER = ["windows", "linux"];

const GROUP_ICONS = {
  windows: Monitor,
  linux: Terminal,
};


/** Returns a download id, "mobile", or null when we can't tell. */
function detectRecommended() {
  const ua = navigator.userAgent.toLowerCase();

  if (/android|iphone|ipad|ipod/.test(ua)) return "mobile";
  if (ua.includes("windows")) return "windows-installer";
  if (ua.includes("mac")) return null;
  if (ua.includes("linux") || ua.includes("x11")) {
    if (/fedora|suse|red hat|centos/.test(ua)) return "linux-rpm";
    if (/ubuntu|debian|mint/.test(ua)) return "linux-deb";
    return "linux-appimage";
  }
  return null;
}

function CopyCommand({ command, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the command is still selectable */
    }
  };

  return (
    <div className="dl-command" dir="ltr">
      <code>{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function DownloadLink({ item, label }) {
  return (
    <a className={buttonVariants({})} href={fileUrl(item.file)}>
        <DownloadIcon size={16} />
        {label}
      </a>
  );
}

function Chips({ item }) {
  return (
    <ul className="dl-chips" dir="ltr">
      <li>{item.ext}</li>
      <li>{item.arch}</li>
      <li>{item.size}</li>
    </ul>
  );
}

export default function Download() {
  const { t, i18n } = useTranslation("Download");

  const meta = t("meta", { returnObjects: true });
  const actions = t("actions", { returnObjects: true });
  const groups = t("groups", { returnObjects: true });
  const items = t("items", { returnObjects: true });
  const help = t("help", { returnObjects: true });

  // Detected after mount so server HTML and first client render match.
  const [detected, setDetected] = useState(null);
  useEffect(() => setDetected(detectRecommended()), []);

  const recommended = DOWNLOADS.find((d) => d.id === detected);

  const releaseDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(RELEASE_DATE));

  return (
    <div className="dl">
      <header className="dl-hero">
        <a className={buttonVariants({variant: "ghost", size: "sm"})} href="/">
            <ArrowLeft size={16} />
            {meta.back}
          </a>

        <Badge variant="secondary">
          <Package size={13} />
          {meta.badge}
        </Badge>

        <h1>{meta.title}</h1>
        <p className="dl-hero__subtitle">{meta.subtitle}</p>

        <p className="dl-hero__version">
          {t("meta.version", { version: VERSION })}
          <span aria-hidden="true">·</span>
          {t("meta.released", { date: releaseDate })}
        </p>
      </header>

      <div className="dl-main">
        {detected === "mobile" && (
          <div className="dl-callout">
            <Info size={16} />
            <p>{actions.mobile}</p>
          </div>
        )}

        {recommended && (
          <section className="dl-recommended" aria-labelledby="dl-rec-title">
            <div className="dl-recommended__text">
              <span className="dl-recommended__label" id="dl-rec-title">
                {actions.recommended}
              </span>
              <h2>{items[recommended.id].name}</h2>
              <p>{items[recommended.id].desc}</p>
              <Chips item={recommended} />
            </div>

            <DownloadLink item={recommended} label={actions.download} />
          </section>
        )}

        <h2 className="dl-all">{actions.all}</h2>

        {GROUP_ORDER.map((groupId) => {
          const list = DOWNLOADS.filter((d) => d.group === groupId);
          if (!list.length) return null;

          const Icon = GROUP_ICONS[groupId];
          const group = groups[groupId];

          return (
            <section key={groupId} className="dl-group">
              <div className="dl-group__head">
                <Icon size={20} />
                <h3>{group.title}</h3>
              </div>
              <p className="dl-group__desc">{group.desc}</p>

              <div className="dl-grid">
                {list.map((item) => (
                  <article
                    key={item.id}
                    className={`dl-card${
                      item.id === detected ? " is-recommended" : ""
                    }`}
                  >
                    <h4>{items[item.id].name}</h4>
                    <p>{items[item.id].desc}</p>
                    <Chips item={item} />

                    {item.command && (
                      <CopyCommand
                        command={item.command(item.file)}
                        copyLabel={actions.copy}
                        copiedLabel={actions.copied}
                      />
                    )}

                    <DownloadLink item={item} label={actions.download} />
                  </article>
                ))}
              </div>

              {group.note && (
                <div className="dl-callout">
                  <Info size={16} />
                  <p>{group.note}</p>
                </div>
              )}
            </section>
          );
        })}

        <p className="dl-help">
          {help.text} <a href="/feedback">{help.link}</a>
        </p>
      </div>
    </div>
  );
}
