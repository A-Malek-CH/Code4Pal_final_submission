import React, { useContext } from "react";
import { Heart, Home, Package, PlusCircle, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const SidebarComponent = () => {

    const { handlLogOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        handlLogOut();
        navigate("/");
    };

    return (
        <aside className="w-64 bg-black text-white min-h-screen fixed top-0 right-0 flex flex-col shadow-xl z-10" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="text-center py-6 border-b border-white/10 mx-5">
                <h1 className="text-xl font-bold mb-1">{t('sidebar.title')}</h1>
                <p className="text-gray-400 text-sm">{t('sidebar.description')}</p>
            </div>

            <nav className="flex-1">
                <ul className="space-y-1">
                    <li>
                        <a href="/ProductsDashboard" className="flex items-center px-6 py-4 hover:bg-white/5 transition-colors border-r-4 border-transparent">
                            <Package className="ml-3 w-5 h-5 mx-3" />
                            <span>{t('sidebar.nav.products')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="/AddProduct" className="flex items-center px-6 py-4 hover:bg-white/5 transition-colors border-r-4 border-transparent">
                            <PlusCircle className="ml-3 w-5 h-5 mx-3" />
                            <span>{t('sidebar.nav.addProduct')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="/donations" className="flex items-center px-6 py-4 hover:bg-white/5 transition-colors border-r-4 border-transparent">
                            <Heart className="ml-3 w-5 h-5 mx-3" />
                            <span>{t('sidebar.nav.donations')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="/ProfilePage" className="flex items-center px-6 py-4 hover:bg-white/5 transition-colors border-r-4 border-transparent">
                            <Settings className="ml-3 w-5 h-5 mx-3" />
                            <span>{t('sidebar.nav.settings')}</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="border-t border-white/10">
                <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center px-6 py-4 hover:bg-white/5 transition-colors text-left"
                >
                    <Home className="ml-3 w-5 h-5 mx-3" />
                    <span>{t('sidebar.nav.home')}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-6 py-4 hover:bg-white/5 transition-colors text-left text-red-400 mb-5"
                >
                    <LogOut className="ml-3 w-5 h-5 mx-3" />
                    <span>{t('sidebar.nav.logout')}</span>
                </button>
            </div>
        </aside>
    );
};

export default SidebarComponent;