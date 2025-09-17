import React from "react";
import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";

const DisplayProductDetails = ({ product }) => {
    const { t, i18n } = useTranslation();
    if (!product) return null;

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "available":
                return "bg-green-100 text-green-800";
            case "sold":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const getStatusLabel = (status) => {
        switch (status.toLowerCase()) {
            case "available":
                return t("displayProductDetails.status.available");
            case "sold":
                return t("displayProductDetails.status.sold");
            default:
                return t("displayProductDetails.status.pending");
        }
    };

    return (
        <div
            className="w-screen mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-8"
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="flex justify-center">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={product.images?.[0]?.imageUrl}
                            alt={product.title}
                            className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-lg"
                        />
                    </div>
                </div>

                <div className="space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold text-green-700">{product.title}</h1>
                        <p className="text-gray-500 text-sm mt-1">{t("displayProductDetails.productNameLabel")}</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-green-700">
                            ${product.fixedPrice}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{t("displayProductDetails.priceLabel")}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">{t("displayProductDetails.statusLabel")}</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(product.status)}`}
                            >
                                {getStatusLabel(product.status)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">{t("displayProductDetails.categoryLabel")}</span>
                            <span className="text-gray-600">
                                {Array.isArray(product.categories)
                                    ? product.categories.map((c) => c.name).join(", ")
                                    : product.categories?.name || product.categories || t("displayProductDetails.noCategory")}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">{t("displayProductDetails.addedDateLabel")}</span>
                            <span className="text-gray-600">
                                {new Date(product.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit size={20} />
                            {t("displayProductDetails.editButton")}
                        </button>
                    </div>

                    {product.description && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{t("displayProductDetails.descriptionTitle")}</h3>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <h3 className="text-green-700 font-bold">{t("displayProductDetails.donationTitle")}</h3>
                        <p className="text-gray-700 text-sm">
                            {t("displayProductDetails.donationDescription1")}
                        </p>
                        <p className="text-gray-700 text-sm">
                            {t("displayProductDetails.donationDescription2")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayProductDetails;