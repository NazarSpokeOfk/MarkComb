import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationRU from '../public/locales/ru/translation.json';
import translationEN from '../public/locales/en/translation.json';

i18n
  .use(initReactI18next) // подключаем React
  .init({
    resources: {
      ru: { translation: translationRU },
      en: { translation: translationEN },
    },
    lng:  navigator.language.split('-')[0], // язык по умолчанию
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
