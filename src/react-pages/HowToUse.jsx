import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, Info } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import "./HowToUse.css";

function Steps({ items }) {
  if (!items?.length) return null;
  return (
    <ol className="htu-steps">
      {items.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}

function Bullets({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="htu-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Callout({ children }) {
  if (!children) return null;
  return (
    <div className="htu-callout">
      <Info size={16} />
      <p>{children}</p>
    </div>
  );
}

function DataTable({ table }) {
  if (!table) return null;
  return (
    <div className="htu-table-wrap">
      <table className="htu-table">
        <thead>
          <tr>
            {table.head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={`${row[0]}-${i}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBody({ block }) {
  return (
    <>
      {block.intro && <p className="htu-intro">{block.intro}</p>}

      {block.groups?.map((group) => (
        <div key={group.heading} className="htu-group">
          <h4>{group.heading}</h4>
          <Steps items={group.steps} />
        </div>
      ))}

      <Steps items={block.steps} />
      <Bullets items={block.bullets} />
      <DataTable table={block.table} />

      {block.expected && (
        <p className="htu-expected">
          <strong>Expected: </strong>
          {block.expected}
        </p>
      )}

      {block.template && <pre className="htu-template">{block.template}</pre>}

      <Callout>{block.callout}</Callout>
    </>
  );
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function HowToUse() {
  const { t } = useTranslation("HowToUse");

  const meta = t("meta", { returnObjects: true });
  const sections = t("sections", { returnObjects: true });
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <div className="htu">
      <header className="htu-hero">
        <a className={buttonVariants({variant: "ghost", size: "sm"})} href="/">
            <ArrowLeft size={16} />
            {meta.back}
          </a>

        <h1>{meta.title}</h1>
        <p className="htu-hero__subtitle">{meta.subtitle}</p>

        <div className="htu-hero__actions">
          <a className={buttonVariants({})} href="/download">
              <Download size={16} />
              {meta.download}
            </a>
        </div>

        <p className="htu-hero__note">{meta.note}</p>
      </header>

      <div className="htu-layout">
        <nav className="htu-toc" aria-label={meta.toc}>
          <span className="htu-toc__title">{meta.toc}</span>

          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={active === section.id ? "is-active" : ""}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="htu-content">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="htu-section">
              <div className="htu-section__head">
                <span className="htu-section__num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{section.title}</h2>
              </div>

              <SectionBody block={section} />

              {section.subsections?.map((sub) => (
                <div key={sub.heading} className="htu-sub">
                  <h3>{sub.heading}</h3>
                  <SectionBody block={sub} />
                </div>
              ))}

              {section.faq && (
                <dl className="htu-faq">
                  {section.faq.map((item) => (
                    <div key={item.q}>
                      <dt>{item.q}</dt>
                      <dd>{item.a}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
