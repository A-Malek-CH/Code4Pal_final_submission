import React, { useEffect, useState, useRef } from "react";
import { Heart, Info, Upload, X } from "lucide-react";
import SidebarComponent from "../components/SidebarComponent.jsx";
import client from "../apiServices/api.js";
import { useTranslation } from "react-i18next";

const AddProduct = () => {
    const { t, i18n } = useTranslation();
    const [donationPercent, setDonationPercent] = useState(100);
    const [images, setImages] = useState([]); // store File objects
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await client.get("/api/categories/get/all");
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    // handle selecting images
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    // remove an image
    const removeImage = (index) => {
        if (window.confirm(t("addProduct.confirmDeleteImage"))) {
            setImages(images.filter((_, i) => i !== index));
        }
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const productData = {
            sellerId: localStorage.getItem("userId"),
            title: e.target["product-title"].value,
            description: e.target["product-description"].value,
            priceType: "FIXED",
            fixedPrice: parseFloat(e.target["product-price"].value),
            status: "AVAILABLE",
            categories_ids: [parseInt(e.target["product-category"].value)],
            donationPercentage: donationPercent,
        };

        try {
            const res = await client.post("/Add-Product", productData);
            const productId = res.data.productId;

            for (let file of images) {
                const formData = new FormData();
                formData.append("file", file);

                await client.post(`/products/${productId}/upload-image`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            alert(t("addProduct.successMessage"));
            e.target.reset();
            setImages([]);
        } catch (err) {
            console.error("Error adding product:", err);
            alert(t("addProduct.errorMessage"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex w-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <SidebarComponent />

            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                            {t("addProduct.title")}
                            <div className="absolute -bottom-3 right-1/2 transform translate-x-1/2 w-24 h-1 bg-green-600 rounded"></div>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6">
                            {t("addProduct.subtitle")}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    {/* Product Title */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">{t("addProduct.form.titleLabel")}</label>
                        <input
                            name="product-title"
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                            placeholder={t("addProduct.form.titlePlaceholder")}
                            required
                        />
                    </div>

                    {/* Product Description */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">{t("addProduct.form.descriptionLabel")}</label>
                        <textarea
                            name="product-description"
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                            placeholder={t("addProduct.form.descriptionPlaceholder")}
                        />
                    </div>

                    {/* Grid for Price, Category, and Status */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Price */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3">{t("addProduct.form.priceLabel")}</label>
                            <input
                                name="product-price"
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                                placeholder={t("addProduct.form.pricePlaceholder")}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3">{t("addProduct.form.categoryLabel")}</label>
                            <select
                                name="product-category"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                                required
                            >
                                <option value="">{t("addProduct.form.categoryPlaceholder")}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3">{t("addProduct.form.statusLabel")}</label>
                            <select
                                name="product-status"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                                required
                            >
                                <option value="AVAILABLE">{t("addProduct.form.status.available")}</option>
                                <option value="PENDING">{t("addProduct.form.status.pending")}</option>
                                <option value="SOLD">{t("addProduct.form.status.sold")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">{t("addProduct.form.imagesLabel")}</label>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-600 transition-colors"
                        >
                            <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 font-medium">{t("addProduct.form.imagesUploadText")}</p>
                            <p className="text-sm text-gray-500 mt-2">{t("addProduct.form.imagesSupportedFormats")}</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Preview Images */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {images.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Donation Percentage */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-green-700">{t("addProduct.form.donationTitle")}</h2>
                        </div>
                        <p className="text-gray-600">{t("addProduct.form.donationDescription")}</p>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">
                                    {t("addProduct.form.donationPercentageLabel")}
                                </span>
                                <span className="text-green-700 font-bold">{donationPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={donationPercent}
                                onChange={(e) => setDonationPercent(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                            />
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-green-200">
                            <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">
                                {donationPercent === 100
                                    ? t("addProduct.form.donationAllProfits")
                                    : t("addProduct.form.donationPercentageText", { percent: donationPercent })}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            type="button"
                            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                        >
                            {t("addProduct.form.cancelButton")}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {t("addProduct.form.submitting")}
                                </>
                            ) : (
                                t("addProduct.form.submitButton")
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddProduct;