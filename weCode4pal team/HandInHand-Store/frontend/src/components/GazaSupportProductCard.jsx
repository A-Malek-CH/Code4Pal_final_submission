import { HeartHandshake, CheckCircle2, HandCoins } from "lucide-react";

function GazaSupportProductCard() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-md mx-auto" dir="rtl">
            {/* Product Header with Image */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 leading-tight text-right mb-2">
                        ساعة ذكية مارك سامسونج - الجيل الخامس
                    </h2>
                    <div className="flex items-center gap-2 mb-3">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              🔧 إلكترونيات
            </span>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
              جديد
            </span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                        $120
                    </div>
                </div>

                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center ml-4 overflow-hidden">
                    <img
                        src="/samsung-watch.png"
                        alt="Samsung Smart Watch Generation 5"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            </div>

            {/* Profit Section */}
            <div className="bg-green-50 border-r-4 border-green-500 p-4 mb-4 rounded-lg">
                <h3 className="text-green-700 font-semibold text-lg mb-2 text-right">
                    % من الربح
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                    <div className="flex items-start gap-2 text-right">
                        <HandCoins className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>كل الأرباح من هذا المنتج ستذهب لدعم أهالي غزة</span>
                    </div>
                    <div className="flex items-start gap-2 text-right">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>تبرعك سيصل مباشرة إلى العائلات المحتاجة في قطاع غزة</span>
                    </div>
                </div>
            </div>

            {/* Donation Support Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-blue-700 font-semibold text-base mb-3 text-right">
                    نتبرع لك بدعم غزة
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed text-right mb-3">
                    كل عملية شراء أو مزايدة تساهم في دعم العائلات المحتاجة في قطاع غزة. شكراً
                    لمساهمتك في
                </p>
                <p className="text-blue-700 text-sm text-right mb-2">
                    إغاثة أطفالنا في فلسطين.
                </p>
            </div>
        </div>
    );
}
export default GazaSupportProductCard;