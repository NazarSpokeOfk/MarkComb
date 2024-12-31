import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';



i18n
  .use(HttpBackend) // Подгрузка переводов с backend
  .use(LanguageDetector) // Определение языка пользователя
  .use(initReactI18next) // Интеграция с React
  .init({
    fallbackLng: 'en', // Язык по умолчанию
    debug: false, // Включить консольное логирование
    interpolation: {
      escapeValue: false, // Для работы с React не нужно экранирование
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Путь к JSON-файлам
    },
  });

export default i18n;
