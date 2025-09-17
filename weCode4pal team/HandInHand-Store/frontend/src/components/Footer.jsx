import { FaInstagram, FaYoutube, FaTwitter ,FaFacebook,FaEnvelope,FaPhone,FaMapMarkerAlt, FaHandshake} from "react-icons/fa";
import "./styles/Footer.css";
import { FaAngleLeft } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

function Footer(){
    const { t } = useTranslation();

    return(
        <footer className="footer">
            <div className="footer-container">
                {/* Colonne 1 */}
                <div className="footer-column">
                    <FaHandshake className="Hand-icon"/>
                    <h3 className="footer-title footer-subtitle">{t("footer.title")}</h3>
                    <p className="footer-text">{t("footer.description")}</p>
                    <div className="footer-socials">
                        <FaYoutube />
                        <FaInstagram />
                        <FaTwitter />
                        <FaFacebook />
                    </div>
                </div>

                {/* Colonne 2 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">{t("footer.quickLinks.title")}</h4>
                    <ul>
                        <li><FaAngleLeft className="angle"/> {t("footer.quickLinks.home")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.quickLinks.products")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.quickLinks.donations")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.quickLinks.about")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.quickLinks.contact")}</li>
                    </ul>
                </div>

                {/* Colonne 3 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">{t("footer.help.title")}</h4>
                    <ul>
                        <li><FaAngleLeft className="angle"/> {t("footer.help.faq")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.help.shipping")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.help.returns")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.help.privacy")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.help.terms")}</li>
                    </ul>
                </div>

                {/* Colonne 4 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">{t("footer.categories.title")}</h4>
                    <ul>
                        <li><FaAngleLeft className="angle"/> {t("footer.categories.electronics")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.categories.clothes")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.categories.books")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.categories.home")}</li>
                        <li><FaAngleLeft className="angle"/> {t("footer.categories.art")}</li>
                    </ul>
                </div>

                {/* Colonne 5 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">{t("footer.contact.title")}</h4>
                    <p><FaEnvelope/> {t("footer.contact.email")}</p>
                    <p><FaPhone/> {t("footer.contact.phone")}</p>
                    <p><FaMapMarkerAlt/> {t("footer.contact.address")}</p>
                </div>
            </div>

            <div className="footer-bottom">{t("footer.bottom")}</div>
        </footer>
    );
}

export default Footer;
