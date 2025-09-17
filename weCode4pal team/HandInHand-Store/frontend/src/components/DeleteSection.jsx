import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUser } from "../apiServices/authService.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DeleteSection = ({ isLoading, setIsLoading, setUser }) => {
    const { t, i18n } = useTranslation();
    const [deleteValue, setDeleteValue] = useState("");
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        const confirmText = t('deleteSection.confirmText');
        if (deleteValue === confirmText) {
            if (confirm(t('deleteSection.confirmPrompt'))) {
                setIsLoading(true);
                try {
                    const userId = localStorage.getItem('userId');
                    await deleteUser(userId);

                    localStorage.removeItem("userId");
                    localStorage.removeItem("userEmail");
                    setUser(null);
                    alert(t('deleteSection.successMessage'));
                    navigate("/");
                } catch (error) {
                    console.error("Delete account failed:", error);
                    alert(t('deleteSection.errorMessage'));
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            alert(t('deleteSection.invalidConfirmMessage'));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[620px]" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center mx-4">
                    <Trash2 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{t('deleteSection.title')}</h2>
            </div>
            <p className="text-gray-600 mb-8">{t('deleteSection.description')}</p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <h3 className="flex items-center gap-2 text-red-600 font-bold text-lg mb-4">
                    {t('deleteSection.warningTitle')}
                </h3>
                <p className="text-gray-700 mb-4">{t('deleteSection.warningDescription')}</p>

                <p className="text-gray-700">{t('deleteSection.exportRecommendation')}</p>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">{t('deleteSection.confirmLabel')}</label>
                <input
                    type="text"
                    value={deleteValue}
                    onChange={(e) => setDeleteValue(e.target.value)}
                    placeholder={t('deleteSection.confirmPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-100"
                />
            </div>

            <div className="flex justify-start">
                <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all disabled:opacity-50"
                >
                    {t('deleteSection.confirmButton')}
                </button>
            </div>
        </div>
    );
};

export default DeleteSection;