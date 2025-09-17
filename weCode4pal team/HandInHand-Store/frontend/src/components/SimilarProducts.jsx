import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";

function SimilarProducts (){
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'en');
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('dir', language === "ar" ? 'rtl' : 'ltr');
    }, [language]);

    const cards = [
        { img: "/images/phone.jpg", title: "هاتف ذكي", description: "أحدث الهواتف الذكية بأسعار رائعة" },
        { img: "/images/book.jpg", title: "كتاب تعليمي", description: "تعلم البرمجة خطوة بخطوة" },
        { img: "/samsung-watch.png", title: "ساعة يد", description: "تصميم أنيق وعصري" },
    ];

    return(
        <div className="flex flex-col">
            <h1 className="m-4 text-3xl font-bold text-gray-900 text-center tracking-wide">
                {t("similar_products")}
            </h1>
            <div className="flex flex-row justify-end">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl p-5 w-[200px] m-2 text-center shadow-md"
                >
                    <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-[170px] object-cover rounded-lg mb-2"
                    />
                <h2 className="text-lg mb-2">{card.title}</h2>
                        <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SimilarProducts;