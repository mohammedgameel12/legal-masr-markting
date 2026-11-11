import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';
import './Feedback.css';

export default function Feedback() {
  const { t } = useTranslation('Feedback');
  const support = import.meta.env.PUBLIC_SUPPORT_URL || 'mailto:Mahmoud.s.khedr.2@gmail.com';
  return <div className="fb">
    <header className="fb-hero">
      <h1>{t('title')}</h1>
      <p className="fb-hero__subtitle">{t('subtitle')}</p>
    </header>
    <div className="fb-main">
      <p>{t('details')}</p>
      <p>{t('privacy')}</p>
      <p><a className={buttonVariants({})} href={support}>{t('contact')}</a></p>
    </div>
  </div>;
}
