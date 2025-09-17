import "./Hero.css";
import { FaMessage } from 'react-icons/fa6';
function Hero(){

    return(
        <section className="hero">
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1>ساهم في دعم أهالي غزة من خلال متجرنا</h1>
                    <p>أرباحنا تذهب مباشرة لمساعدة العائلات في غزة، تسوق الآن وساهم في صنع الفرق.</p>
                        <div className="hero-buttons">
                            <button className="btn-outline">تعرف على مبادراتنا</button>
                            <button className="btn-green">تصفح المنتجات</button>
                        </div>
                    <button className="circle-btn floating-btn"><FaMessage className="circle-icon"/></button>
                </div>
            </div>
        </section>
    );
}

export default Hero