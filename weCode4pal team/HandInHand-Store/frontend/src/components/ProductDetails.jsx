import React, { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductDetails = ({ product }) => {
  const {addToCart, isInCart, getItemQuantity} = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (!product) return null; // safeguard

  // Quantity handler
  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 99)) {
      setSelectedQuantity(newQuantity);
    }
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    addToCart(product,selectedQuantity);
    alert(`تم إضافة ${selectedQuantity} من ${product.title} إلى السلة`);
  };

  const currentCartQuantity = getItemQuantity(product.id);
  const isProductInCart = isInCart(product.id);

  return (
      <div
          className="w-screen mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-6"
          dir="rtl"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="flex flex-row md:flex-row gap-8">
            {/* Product Images */}
            <div className="md:w-1/2 space-y-1">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={product.images?.[0].imageUrl}
                    alt={product.title}
                    className="w-[900px] h-[500px] object-cover"
                />
              </div>

              {product.images?.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].imageUrl}
                            alt={product.title}
                            className="w-full h-[120px] object-cover rounded-lg mb-2"
                        />
                    ) : (
                        <div className="w-full h-[120px] bg-gray-300 rounded-lg mb-2"></div>
                    )}
                  </div>
              )}
            </div>

          {/* Product Info */}
          <div className="md:w-1/2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {product.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-700">
              ${product.fixedPrice}
            </span>
              {product.originalPrice && (
                  <>
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
                    {product.discount && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                    -{product.discount}%
                  </span>
                    )}
                  </>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">الكمية</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={selectedQuantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                  {selectedQuantity}
                </span>
                  <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                          selectedQuantity >= (product.stockQuantity || 99)
                      }
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {isProductInCart && (
                    <span className="text-sm text-gray-600">
                  (في السلة: {currentCartQuantity})
                </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={20} />
                {isProductInCart
                    ? "إضافة المزيد إلى السلة"
                    : "إضافة إلى السلة"}
              </button>
            </div>

            {/* Description */}
            {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">وصف المنتج</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {product.description}
                  </p>
                  {product.features?.length > 0 && (
                      <>
                        <h4 className="font-semibold mb-2">المميزات:</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {product.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </>
                  )}
                </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <h3 className="text-green-700 font-bold">% من الربح</h3>
              <p className="text-gray-700 text-sm">
                كل الأرباح من بيع هذا المنتج ستذهب لدعم أهالي غزة.
              </p>
              <p className="text-gray-700 text-sm">
                تبرعك سيصل مباشرة إلى العائلات المحتاجة في قطاع غزة.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <h3 className="text-red-700 font-bold">تبرعك يدعم غزة ❤️</h3>
              <p className="text-gray-700 text-sm">
                كل عملية شراء أو مزايدة تساهم في دعم العائلات المحتاجة في قطاع غزة.
              </p>
              <p className="text-gray-600 text-xs mt-2">
                نحن مع غزة. دعمك يصنع الفرق 🌿
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default ProductDetails;
