import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import React from "react";

const LanguageSection = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        const selectedLanguage = e.target.value;
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[620px]">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-4">
                    <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{t('languageSection.title')}</h2>
            </div>
            <p className="text-gray-600 mb-8">{t('languageSection.description')}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('languageSection.languageLabel')}</label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                        onChange={changeLanguage}
                        value={i18n.language}
                    >
                        <option value="ar">{t('languageSection.arabic')}</option>
                        <option value="en">{t('languageSection.english')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('languageSection.currencyLabel')}</label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    >
                        <option value="ils">{t('languageSection.ils')}</option>
                        <option value="usd">{t('languageSection.usd')}</option>
                        <option value="eur">{t('languageSection.eur')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('languageSection.dateFormatLabel')}</label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    >
                        <option value="dd/mm/yyyy">{t('languageSection.dateFormat1')}</option>
                        <option value="mm/dd/yyyy">{t('languageSection.dateFormat2')}</option>
                        <option value="yyyy-mm-dd">{t('languageSection.dateFormat3')}</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-start">
                <button
                    className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {t('languageSection.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default LanguageSection;