import { FaHandHoldingUsd, FaHeart, FaShieldAlt } from "react-icons/fa";
import "./Card.css";


function Card(){

    const cards = [
    {
      icon: <FaHeart className="card-icon" />,
      title: "تأثير حقيقي",
      description: "قصص حقيقية عن كيفية مساعدة تبرعاتك للأسر في غزة"
    },
    {
      icon: <FaShieldAlt className="card-icon" />,
      title: "شفافية كاملة",
      description: "تتبع تبرعاتك ومعرفة الجهات المستفيدة بالتفصيل"
    },
    {
      icon: <FaHandHoldingUsd className="card-icon" />,
      title: "%",
      description: "اختر المنتج أو تعامل وحدد نسبة منه لدعم أهالي غزة مباشرة"
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Bloc texte au-dessus */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "25px", fontWeight: "bold",color :"black"}}>كيف يعمل متجرنا؟</h2>
        <div style={{
                        width: "50px",
                        height: "3px",
                        backgroundColor: "green",
                        margin: "8px auto"
                    }}></div>
        <p style={{ fontSize: "22px", color: "#040404ff" }}>
          منصة سهلة الاستخدام تربط بين البائعين والمشترين لدعم القضية الفلسطينية
        </p>
      </div>
      {/* Bloc des cartes */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
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

export default Card

