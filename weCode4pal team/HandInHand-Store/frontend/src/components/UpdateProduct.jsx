import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import client from "../apiServices/api.js";
import { useTranslation } from "react-i18next";

const UpdateProduct = () => {
    const { t, i18n } = useTranslation();
    const { state } = useLocation();
    const { productId } = useParams();
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState(
        state?.product || {
            title: "",
            description: "",
            priceType: "FIXED",
            fixedPrice: 0,
            status: "AVAILABLE",
            donationPercentage: 0,
            categories: [],
        }
    );

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await client.get("/api/categories/get/all");
                console.log("Fetched categories:", JSON.stringify(response.data, null, 2));
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError(t("updateProduct.error.categoriesLoadFailed"));
            }
        };

        fetchCategories();
    }, [t]);

    useEffect(() => {
        if (state?.product) {
            setFormValues({
                ...state.product,
                categories: state.product.categories || [],
                donationPercentage: state.product.donationPercentage || 0,
            });
        } else {
            const fetchProduct = async () => {
                try {
                    const res = await client.get(`/api/products/getById?id=${productId}`);
                    setFormValues({
                        ...res.data,
                        categories: res.data.categories || [],
                        donationPercentage: res.data.donationPercentage || 0,
                    });
                } catch (err) {
                    console.error("❌ Failed to fetch product", err);
                    setError(t("updateProduct.error.productFetchFailed"));
                }
            };
            fetchProduct();
        }
    }, [productId, state?.product, t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!formValues.title) {
            setError(t("updateProduct.validation.titleRequired"));
            return;
        }
        if (!formValues.status) {
            setError(t("updateProduct.validation.statusRequired"));
            return;
        }
        if (!formValues.categories.length) {
            setError(t("updateProduct.validation.categoryRequired"));
            return;
        }

        try {
            const res = await client.put(`/api/products/update/${productId}`, formValues);
            alert(t("updateProduct.successMessage"));
            navigate("/ProductsDashboard");
        } catch (err) {
            console.error("❌ Failed to update product", err);
            setError(t("updateProduct.error.updateFailed"));
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-2xl font-bold mb-6">{t("updateProduct.title")}</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block font-medium mb-1">{t("updateProduct.form.titleLabel")}</label>
                    <input
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block font-medium mb-1">{t("updateProduct.form.priceLabel")}</label>
                    <input
                        name="fixedPrice"
                        type="number"
                        value={formValues.fixedPrice}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block font-medium mb-1">{t("updateProduct.form.categoryLabel")}</label>
                    <select
                        name="categoryId"
                        value={formValues.categories[0]?.id || ""}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                categories: [{ id: e.target.value }],
                            }))
                        }
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                    >
                        <option value="">{t("updateProduct.form.categoryPlaceholder")}</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block font-medium mb-1">{t("updateProduct.form.statusLabel")}</label>
                    <select
                        name="status"
                        value={formValues.status}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                    >
                        <option value="AVAILABLE">{t("updateProduct.form.status.available")}</option>
                        <option value="PENDING">{t("updateProduct.form.status.pending")}</option>
                        <option value="SOLD">{t("updateProduct.form.status.sold")}</option>
                    </select>
                </div>

                {/* Donation Percentage */}
                <div>
                    <label className="block font-medium mb-1">{t("updateProduct.form.donationPercentageLabel")}</label>
                    <input
                        type="number"
                        name="donationPercentage"
                        value={formValues.donationPercentage}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        min="0"
                        max="100"
                        step="0.01"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">{t("updateProduct.form.descriptionLabel")}</label>
                    <textarea
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                >
                    {t("updateProduct.form.submitButton")}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;