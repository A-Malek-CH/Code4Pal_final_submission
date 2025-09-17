import { FaBoxOpen, FaHome, FaInfoCircle,FaShoppingCart,FaUser,FaHandHoldingHeart, FaPhone,FaHandshake } from "react-icons/fa";
import "./styles/Header.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

function Header() {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'en');
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    console.log("Header sees user:", user);

    useEffect(() => {
        document.documentElement.setAttribute('dir', language === "ar" ? 'rtl' : 'ltr');
    }, [language]);


    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <div className="logo">
                    <FaHandshake className="Hand-icon"/><span>{t("Store")}</span>{t("HandInHand")}
                </div>
                    <nav className="nav">
                        <a href="/"><FaHome/> {t("home_page")}</a>
                        <a href="/shoppingPage"><FaBoxOpen/>{t("products")}</a>
                        <a href="#"><FaHandHoldingHeart/>{t("donation ")}</a>
                        <a href="#"><FaInfoCircle />{t("aboutUs")}</a>
                        <a href="#"><FaPhone />{t("Communicate_with_us")}</a>
                    </nav>
                {/* Buttons */}
                <div className="auth-buttons">
                    {user ? (
                        <>
                            <button
                                className="btn-outline"
                                onClick={() => navigate("/shopingCart")}
                            >
                                <FaShoppingCart />
                            </button>
                            <button
                                className="btn-green"
                                onClick={() => navigate("/profilePage")}
                            >
                                <FaUser />
                            </button>
                        </>
                    ):(
                        <>
                            <button className="btn-outline" onClick={() => navigate("/login")}>{t("Login")}</button>
                            <button className="btn-green" onClick={() => navigate("/register")}>{t("register")}</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
