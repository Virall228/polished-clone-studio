import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={i18n.language === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
    >
      <Globe className="h-5 w-5" />
      <span className="ml-1 text-xs font-semibold uppercase">{i18n.language}</span>
    </Button>
  );
};
