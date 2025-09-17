import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import client from "../apiServices/api.js";
import { useTranslation } from "react-i18next";

const SecuritySection = () => {
    const { t, i18n } = useTranslation();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");

    const handleSecurity = async () => {
        if (newPassword !== confirmPassword) {
            alert(t('securitySection.passwordMismatchMessage'));
            return;
        }

        try {
            const userId = localStorage.getItem('userId');

            const res = await client.patch(`api/users/${userId}/change-password`, {
                currentPassword: oldPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmPassword
            });

            alert(res.data);
            setLastUpdated(res.data.lastUpdated);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            alert(err.response?.data || t('securitySection.errorMessage'));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[620px]" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-4">
                    <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{t('securitySection.title')}</h2>
            </div>
            <p className="text-gray-600 mb-8">{t('securitySection.description')}</p>

            <div className="flex items-center p-4 bg-green-50 rounded-xl mb-8">
                <Check className="w-6 h-6 text-green-600 ml-4" />
                {lastUpdated && (
                    <p>
                        {t('securitySection.statusGood')} • {t('securitySection.lastUpdated', {
                        date: new Date(lastUpdated).toLocaleDateString(i18n.language === 'ar' ? 'ar' : 'en', {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })
                    })}
                    </p>
                )}
            </div>

            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('securitySection.currentPasswordLabel')}</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('securitySection.newPasswordLabel')}</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('securitySection.confirmPasswordLabel')}</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button className="px-8 py-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors">
                    {t('securitySection.cancelButton')}
                </button>
                <button
                    onClick={handleSecurity}
                    className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {t('securitySection.changePasswordButton')}
                </button>
            </div>
        </div>
    );
};

export default SecuritySection;