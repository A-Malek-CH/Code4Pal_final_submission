import { useState } from "react";

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState("/images/watch-main.png");

  const thumbnails = [
    "/images/watch-thumb1.png",
    "/images/watch-thumb2.png",
    "/images/watch-thumb3.png",
    "/images/watch-thumb4.png",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Left: Product Info */}
      <div>
        <h1 className="text-xl font-bold mb-2 text-gray-900">
          ساعة ذكية ماركة سامسونج - الجيل الخامس
        </h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-green-600 font-semibold">$120</span>
          <span className="text-gray-500 line-through">$150</span>
          <span className="text-red-500 text-sm">وفر $30</span>
        </div>

        {/* Profit Box */}
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-sm text-green-700">
          100% من الربح  
          <ul className="mt-2 list-disc list-inside">
            <li>كل المبالغ من هذا المنتج ستذهب لجمعية خيرية</li>
            <li>يرجى التواصل بحسابات المتاجر لتسديد قيمة المنتج</li>
          </ul>
        </div>

        {/* Description */}
        <h2 className="font-bold text-lg mb-2">وصف المنتج</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          ساعة ذكية جديدة من سامسونج الجيل الخامس، مقاومة للماء حتى عمق 50 متر،
          شاشة AMOLED عالية الدقة، بطارية تدوم حتى 7 أيام، مع إمكانية استخدام
          التطبيقات، الساعة مثالية للرياضة وتأتي مع حزام أنيق وسريع الوصول.
        </p>

        {/* Features */}
        <h3 className="font-bold text-lg mb-2">المواصفات التقنية</h3>
        <ul className="text-gray-700 space-y-2">
          <li>✅ مقاومة للماء حتى 50 متر</li>
          <li>✅ شاشة AMOLED عالية الدقة</li>
          <li>✅ نظام تشغيل Tizen OS</li>
          <li>✅ بطارية تدوم حتى 7 أيام</li>
          <li>✅ متتبع للنشاط والرياضة</li>
          <li>✅ نظام تحديد المواقع GPS</li>
        </ul>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            إضافة إلى السلة
          </button>
          <button className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
            اشتري الآن
          </button>
        </div>
      </div>

      {/* Right: Product Images */}
      <div>
        <div className="border rounded-lg overflow-hidden mb-4">
          <img
            src={selectedImage}
            alt="المنتج"
            className="w-full object-cover"
          />
        </div>
        <div className="flex gap-3">
          {thumbnails.map((img, i) => (
            <div
              key={i}
              className={`w-20 h-20 border rounded-lg cursor-pointer overflow-hidden ${
                selectedImage === img ? "border-green-500" : ""
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt="صورة مصغرة"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
