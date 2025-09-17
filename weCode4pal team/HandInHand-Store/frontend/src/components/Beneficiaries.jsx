import "./styles/Beneficiaries.css";
import { useTranslation } from "react-i18next";

function Beneficiaries() {
  const { t } = useTranslation();
  const testimonials = [
    {
      text: "بفضل تبرعاتكم، استطعنا ترميم منزل عائلتنا الذي تضرر للدمار. كلمات الشكر لا تكفي للتعبير عن امتناننا.",
      name: "أحمد أبو ريدة",
      role: "مستفيد من مشروع الإيواء",
    },
    {
      text: "المستلزمات الطبية التي وصلتنا ساعدت في إنقاذ حياة العشرات من الأطفال والجرحى. التبرع عبر هذا المتجر ليس مجرد عملية بيع، بل هو شريان حياة.",
      name: "د. سمية النجار",
      role: "طبيبة في مستشفى الشفاء",
    },
    {
      text: "بفضل التبرعات التي حصلنا عبر متجر غزة للجميع، استطعنا توفير وجبات عائلية تغذي مئات العائلات في المناطق الأكثر احتياجاً.",
      name: "د. محمد عبد الرحمن",
      role: "مدير جمعية إغاثة غزة",
    },
  ];

  return (
    <section className="beneficiaries-section">
      <div className="beneficiaries-header">
        <h2> {t("beneficiaries.header.title")}</h2>
        <div className="header-line"></div>
        <p>{t("beneficiaries.header.subtitle")}</p>
      </div>

      <div className="beneficiaries-cards">
        {testimonials.map((t, index) => (
          <div key={index} className="beneficiary-card">
            <p className="testimonial-text">"{t.text}"</p>
            <p className="testimonial-name">{t.name}</p>
            <p className="testimonial-role">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Beneficiaries;
