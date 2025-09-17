import React from "react";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, onDisplayDetails, onAddToCart }) => {
    const { t, i18n } = useTranslation();
    console.log("ProductCard received:", product);

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="relative mb-4">
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].imageUrl}
                            alt={product.title}
                            className="w-full object-cover rounded-lg mb-2"
                        />
                    ) : (
                        <div className="w-full h-[120px] bg-gray-300 rounded-lg mb-2"></div>
                    )}
                </div>
                <span className="absolute top-2 right-2 bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                    {product.category}
                </span>
            </div>

            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
            <span className="text-xl font-bold text-gray-800">${product.fixedPrice}</span>
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => onAddToCart(product)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        {t("productCard.addToCartButton")}
                    </button>
                    <button
                        onClick={() => onDisplayDetails(product)}
                        className="px-4 py-1 text-sm bg-black text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                        {t("productCard.displayDetailsButton")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;