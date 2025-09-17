import { FaHandHoldingUsd, FaHeart, FaShieldAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./styles/Card.css";

function Card() {
    const { t, i18n } = useTranslation();

    const cards = [
        {
            icon: <FaHeart className="card-icon" />,
            title: t("card.realImpactTitle"),
            description: t("card.realImpactDescription"),
        },
        {
            icon: <FaShieldAlt className="card-icon" />,
            title: t("card.fullTransparencyTitle"),
            description: t("card.fullTransparencyDescription"),
        },
        {
            icon: <FaHandHoldingUsd className="card-icon" />,
            title: t("card.percentageTitle"),
            description: t("card.percentageDescription"),
        },
    ];

    return (
        <div className="flex flex-col items-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Text block */}
            <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-black">{t("card.howItWorksTitle")}</h2>
                <div className="w-12 h-1 bg-green-600 mx-auto my-2"></div>
                <p className="text-lg text-gray-800">{t("card.howItWorksDescription")}</p>
            </div>

            {/* Cards block */}
            <div className="flex justify-center flex-wrap">
                {cards.map((card, index) => (
                    <div className="card" key={index}>
                        {card.icon}
                        <h2 className="card-title">{card.title}</h2>
                        <p className="card-description">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Card;