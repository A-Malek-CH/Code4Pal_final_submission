import "./styles/Donates.css"
import { useTranslation } from "react-i18next";

function Donates() {
    const { t } = useTranslation();

    const stats = [
        { value: "$124,850", label: t("total_donations") },
        { value: "5,200+", label: t("benefited_families") },
        { value: "18", label: t("funded_projects") },
        { value: "100%", label: t("transparency") },
    ];

    return (
        <section className="principle">
            <div className="flex flex-col items-center">

                <div className="text-center mb-5">
                    <h2 className="text-[25px] font-bold text-white">{t("donations_impact")}</h2>
                    <div className="w-[50px] h-[3px] bg-green-600 my-2 mx-auto"></div>
                    <p className="text-[22px] text-white">
                        {t("real_stats")}
                    </p>

                    <div className="donates-section">
                        <div className="donates-container">
                            {stats.map((stat, index) => (
                                <div key={index} className="donate-item">
                                    <div className="donate-value">{stat.value}</div>
                                    <div className="donate-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Donates;
