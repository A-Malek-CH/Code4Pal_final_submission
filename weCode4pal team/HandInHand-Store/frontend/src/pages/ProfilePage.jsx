import React, { useContext, useState } from 'react';
import { User, Shield, Bell, Store, Heart, Globe, Trash2, Upload, InfoIcon } from 'lucide-react';
import AuthContext from "../context/AuthContext";
import DeleteSection from "../components/DeleteSection.jsx";
import ProfileSection from "../components/ProfileSection.jsx";
import SecuritySection from "../components/SecuritySection.jsx";
import SidebarComponent from "../components/SidebarComponent.jsx";
import LanguageSection from "../components/LanguageSection.jsx";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
    const { t, i18n } = useTranslation();
    const [activeSection, setActiveSection] = useState('profile');
    const [donationPercent, setDonationPercent] = useState(100);
    const [notifications, setNotifications] = useState({
        email: true,
        inApp: true,
        newOrders: true,
        donations: true,
        offers: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(AuthContext);

    const toggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const SettingsNav = () => {
        const navItems = [
            { id: 'profile', icon: User, label: t('profilePage.nav.profile') },
            { id: 'security', icon: Shield, label: t('profilePage.nav.security') },
            { id: 'notifications', icon: Bell, label: t('profilePage.nav.notifications') },
            { id: 'store', icon: Store, label: t('profilePage.nav.store') },
            { id: 'donation', icon: Heart, label: t('profilePage.nav.donation') },
            { id: 'language', icon: Globe, label: t('profilePage.nav.language') },
            { id: 'delete', icon: Trash2, label: t('profilePage.nav.delete') }
        ];

        return (
            <nav className="bg-white rounded-2xl shadow-lg p-0 min-w-[280px]">
                <ul>
                    {navItems.map((item, index) => (
                        <li key={item.id} className={index < navItems.length - 1 ? 'border-b border-gray-100' : ''}>
                            <button
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center px-6 py-4 text-right transition-all duration-300 border-r-4 ${
                                    activeSection === item.id
                                        ? 'bg-green-50 border-green-600 text-green-600 font-bold'
                                        : 'border-transparent text-gray-600 hover:bg-green-50 hover:text-green-600'
                                }`}
                            >
                                <item.icon className="ml-4 w-5 h-5" />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    const NotificationToggle = ({ label, description, checked, onChange }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors relative">
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </div>
            </label>
        </div>
    );

    const NotificationsSection = () => (
        <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[620px]">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center ml-4 mx-4">
                    <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{t('profilePage.notifications.title')}</h2>
            </div>
            <p className="text-gray-600 mb-8">{t('profilePage.notifications.description')}</p>

            <div className="space-y-1 mb-8">
                <NotificationToggle
                    label={t('profilePage.notifications.emailLabel')}
                    description={t('profilePage.notifications.emailDescription')}
                    checked={notifications.email}
                    onChange={() => toggleNotification('email')}
                />
                <NotificationToggle
                    label={t('profilePage.notifications.inAppLabel')}
                    description={t('profilePage.notifications.inAppDescription')}
                    checked={notifications.inApp}
                    onChange={() => toggleNotification('inApp')}
                />
                <NotificationToggle
                    label={t('profilePage.notifications.newOrdersLabel')}
                    description={t('profilePage.notifications.newOrdersDescription')}
                    checked={notifications.newOrders}
                    onChange={() => toggleNotification('newOrders')}
                />
                <NotificationToggle
                    label={t('profilePage.notifications.donationsLabel')}
                    description={t('profilePage.notifications.donationsDescription')}
                    checked={notifications.donations}
                    onChange={() => toggleNotification('donations')}
                />
                <NotificationToggle
                    label={t('profilePage.notifications.offersLabel')}
                    description={t('profilePage.notifications.offersDescription')}
                    checked={notifications.offers}
                    onChange={() => toggleNotification('offers')}
                />
            </div>

            <div className="flex justify-start">
                <button
                    className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {t('profilePage.notifications.saveButton')}
                </button>
            </div>
        </div>
    );

    const StoreSection = () => (
        <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[620px]">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-4">
                    <Store className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{t('profilePage.store.title')}</h2>
            </div>
            <p className="text-gray-600 mb-8">{t('profilePage.store.description')}</p>

            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('profilePage.store.storeNameLabel')}</label>
                    <input
                        type="text"
                        defaultValue={t('profilePage.store.storeNameDefault')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('profilePage.store.storeDescriptionLabel')}</label>
                    <textarea
                        rows="4"
                        defaultValue={t('profilePage.store.storeDescriptionDefault')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('profilePage.store.storeAddressLabel')}</label>
                    <input
                        type="text"
                        defaultValue={t('profilePage.store.storeAddressDefault')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('profilePage.store.storeLogoLabel')}</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                            <img src="https://via.placeholder.com/80" alt={t('profilePage.store.storeLogoAlt')} className="max-w-full max-h-full" />
                        </div>
                        <div>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                                <Upload className="w-4 h-4" />
                                {t('profilePage.store.changeLogoButton')}
                            </button>
                            <p className="text-xs text-gray-500 mt-2">{t('profilePage.store.logoSizeHint')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button className="px-8 py-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors">
                    {t('profilePage.store.cancelButton')}
                </button>
                <button
                    className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {t('profilePage.store.saveButton')}
                </button>
            </div>
        </div>
    );

    const DonationSection = () => (
        <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[620px]">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-4">
                    <Heart className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{t('profilePage.donation.title')}</h2>
            </div>
            <p className="text-gray-600 mb-8">{t('profilePage.donation.description')}</p>

            <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-4">{t('profilePage.donation.donationPercentLabel')}</label>
                <div className="flex items-center gap-4 mb-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={donationPercent}
                        onChange={(e) => setDonationPercent(e.target.value)}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-xl font-bold text-green-600 min-w-[60px]">{donationPercent}%</span>
                </div>
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                    <InfoIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 font-medium">
                        {t('profilePage.donation.donationPercentInfo', { percent: donationPercent })}
                    </p>
                </div>
            </div>

            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t('profilePage.donation.recipientLabel')}</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100">
                        <option value="unrwa">{t('profilePage.donation.recipientOptions.unrwa')}</option>
                        <option value="red-crescent">{t('profilePage.donation.recipientOptions.redCrescent')}</option>
                        <option value="medical-aid">{t('profilePage.donation.recipientOptions.medicalAid')}</option>
                        <option value="other">{t('profilePage.donation.recipientOptions.other')}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-4">{t('profilePage.donation.reportLabel')}</label>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{t('profilePage.donation.reportToggleLabel')}</h3>
                            <p className="text-sm text-gray-600">{t('profilePage.donation.reportToggleDescription')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors relative">
                                <div
                                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform transform peer-checked:translate-x-6"
                                ></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-start">
                <button
                    className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {t('profilePage.donation.saveButton')}
                </button>
            </div>
        </div>
    );

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'profile': return <ProfileSection />;
            case 'security': return <SecuritySection />;
            case 'notifications': return <NotificationsSection />;
            case 'store': return <StoreSection />;
            case 'donation': return <DonationSection />;
            case 'language': return <LanguageSection />;
            case 'delete': return <DeleteSection isLoading={isLoading} setIsLoading={setIsLoading} setUser={setUser} />;
            default: return <ProfileSection />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex w-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <SidebarComponent />
            <main className="flex-1 mr-64 p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                        {t('profilePage.title')}
                        <div className="absolute -bottom-3 right-1/2 transform translate-x-1/2 w-24 h-1 bg-green-600 rounded"></div>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6">
                        {t('profilePage.description')}
                    </p>
                </div>
                <div className="flex gap-8 max-w-7xl mx-auto">
                    <SettingsNav />
                    <div className="flex-1 min-w-0">
                        {renderActiveSection()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;