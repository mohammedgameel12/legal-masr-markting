import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, MessageSquare } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import "./NotFound.css";

export default function NotFound() {
  const { t } = useTranslation("NotFound");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const meta = t("meta", { returnObjects: true });

  // Go back if there is history to go back to, otherwise go home.
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="nf">
      <div className="nf-card">
        <span className="nf-code" aria-hidden="true">
          404
        </span>

        <h1>{meta.title}</h1>
        <p className="nf-text">{meta.text}</p>

        <code className="nf-path" dir="ltr">
          {pathname}
        </code>

        <div className="nf-actions">
          <a className={buttonVariants({})} href="/">
              <Home size={16} />
              {meta.home}
            </a>

          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft size={16} className="nf-back-icon" />
            {meta.back}
          </Button>
        </div>

        <a href="/feedback" className="nf-report">
          <MessageSquare size={14} />
          {meta.report}
        </a>
      </div>
    </div>
  );
}
