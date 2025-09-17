import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locals/en.json';
import ar from './locals/ar.json';

i18n
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('language') || 'en',
        resources: {
            en: { translation: en },
            ar: { translation: ar },
        },
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng)=>{
   localStorage.setItem('language', lng);
   document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
});
export default i18n;