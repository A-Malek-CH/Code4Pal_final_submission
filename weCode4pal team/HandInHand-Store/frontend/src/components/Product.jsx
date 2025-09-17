import "./styles/Product.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Product() {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/products/get/featured-donation")
            .then((res) => {
                console.log("API response:", res.data);
                setProducts(res.data.slice(0, 10));
                setLoading(false);
            })
            .catch((error) => {
                console.log("API response:", error);
                setError(t("product.errorMessage") + (error.message ? `: ${error.message}` : ""));
                setLoading(false);
            });
    } );

    if (loading) return <p>{t("product.loadingMessage")}</p>;
    if (err) return <p className="text-red-600">{err}</p>;

    return (
        <section className="donation-section" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-2xl font-bold text-black">{t("product.title")}</h2>
            <p className="text-lg text-gray-800 mt-4">{t("product.description")}</p>
            <div className="flex justify-center flex-wrap gap-6 w-full max-w-6xl mx-auto px-4 mt-5">
                {products.map((p) => (
                    <Link
                        to={`/checkoutProduct/${p.id}`}
                        key={p.id}
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-full sm:w-64 lg:w-56 xl:w-52 max-w-xs flex-shrink-0"
                    >

                        <div className="relative overflow-hidden">
                            {p.images && p.images.length > 0 ? (
                                <img
                                    src={p.images[0].imageUrl}
                                    alt={p.title}
                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-36 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {p.donationPercentage && (
                                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                    {t("product.donationBadge", { percentage: p.donationPercentage })}
                                </div>
                            )}
                        </div>

                        <div className="p-3">
                            <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                {p.title}
                            </h2>

                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {p.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-red-700">
                                    ${p.fixedPrice}
                                </span>
                                <div className="bg-black text-white px-3 py-1 rounded-lg text-md font-medium group-hover:bg-green-700 transition-colors">
                                    {t("product.buyNowButton")}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Product;