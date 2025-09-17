import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from "react-i18next";

const ShoppingHero = ({
                          onSearch = () => {}
                      }) => {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query); // ✅ send query up
    };

    return (
        <section className="relative py-5 bg-center bg-cover space-y-[10px]" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="absolute inset-0 bg-gray-200"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-green-800 mb-4">{t("shoppingHero.title")}</h1>
                    <p className="text-xl text-gray-800 mb-8">{t("shoppingHero.subtitle")}</p>

                    <form
                        onSubmit={handleSearch}
                        className="relative max-w-md mx-auto flex items-center"
                    >
                        <Search className="w-5 h-5 absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("shoppingHero.searchPlaceholder")}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
                        >
                            {t("shoppingHero.searchButton")}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ShoppingHero;