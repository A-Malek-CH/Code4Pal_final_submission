import { FaInstagram, FaYoutube, FaTwitter ,FaFacebook,FaEnvelope,FaPhone,FaMapMarkerAlt, FaHandshake} from "react-icons/fa";
import "./Footer.css";
import { FaAngleLeft } from 'react-icons/fa';

function Footer(){
    return(
        <footer className="footer">
            <div className="footer-container">
                 {/* Colonne 1 */}
                <div className="footer-column">
                    <FaHandshake className="Hand-icon"/>
                    <h3 className="footer-title footer-subtitle">متجر غزة للجميع</h3>
                    <p className="footer-text">
                        منصة إلكترونية تمكّنك من المساهمة في دعم أهالي غزة من خلال عمليات الشراء والبيع.
                    </p>
                    <div className="footer-socials">
                        <FaYoutube />
                        <FaInstagram />
                        <FaTwitter />
                        <FaFacebook />
                    </div>
                </div>

                {/* Colonne 2 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">روابط سريعة</h4>
                    <ul>
                        <li><FaAngleLeft className="angle"/> الرئيسية</li>
                        <li><FaAngleLeft className="angle"/> جميع المنتجات</li>
                        <li><FaAngleLeft className="angle"/> التبرعات</li>
                        <li><FaAngleLeft className="angle"/> عن المتجر</li>
                        <li><FaAngleLeft className="angle"/> اتصل بنا</li>
                    </ul>
                </div>

                {/* Colonne 3 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">المساعدة</h4>
                        <ul>
                            <li><FaAngleLeft className="angle"/> الأسئلة الشائعة </li>
                            <li><FaAngleLeft className="angle"/> الشحن والتوصيل</li>
                            <li><FaAngleLeft className="angle"/> سياسة الإرجاع</li>
                            <li><FaAngleLeft className="angle"/> سياسة الخصوصية</li>
                            <li><FaAngleLeft className="angle"/> الشروط والأحكام</li>
                        </ul>
                </div>

                {/* Colonne 4 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">فئات المنتجات</h4>
                    <ul>
                        <li><FaAngleLeft className="angle"/> إلكترونيات </li>
                        <li><FaAngleLeft className="angle"/> ملابس </li>
                        <li><FaAngleLeft className="angle"/> كتب</li>
                        <li><FaAngleLeft className="angle"/> أدوات منزلية</li>
                        <li><FaAngleLeft className="angle"/> أعمال فنية</li>
                    </ul>
                </div>

                 {/* Colonne 5 */}
                <div className="footer-column">
                    <h4 className="footer-subtitle">اتصل بنا</h4>
                    <p><FaEnvelope/> info@gaza-store.com </p>
                    <p><FaPhone/> 0123456789</p>
                    <p><FaMapMarkerAlt/> الجزائر</p>
                </div>
            </div>

            <div className="footer-bottom">.متجر غزة للجميع - جميع الحقوق محفوظة.</div>
        </footer>
    );
}

export default Footer