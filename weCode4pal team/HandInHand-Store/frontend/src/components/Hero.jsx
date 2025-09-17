import "./styles/Hero.css";
import { FaMessage } from 'react-icons/fa6';
import { useTranslation } from "react-i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Hero(){
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'en');
    const navigate = useNavigate();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => {
            console.log("Language changed");
        });
        setLanguage(lng);
        localStorage.setItem('language', lng);
        document.documentElement.setAttribute('dir', lng === "ar" ? 'rtl' : 'ltr');
    };

    useEffect(() => {
        document.documentElement.setAttribute('dir', language === "ar" ? 'rtl' : 'ltr');
    }, [language]);


    return(
        <section className="hero">
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1>{t("hero.title")}</h1>
                    <p>{t("hero.description")}</p>
                        <div className="hero-buttons">
                            <button className="btn-outline">{t("hero.contactButton")}</button>
                            <button className="btn-green" onClick={() => {navigate("/shoppingPage")}}>{t("hero.browseButton")}</button>
                        </div>
                    <button className="circle-btn floating-btn"><FaMessage className="circle-icon"/></button>
                </div>
            </div>
        </section>
    );
}

export default Hero