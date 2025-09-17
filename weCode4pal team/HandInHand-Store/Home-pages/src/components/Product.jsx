import "./Product.css"
function Product (){
   const cards = [
  { img: "/images/phone.jpg", title: "هاتف ذكي", description: "أحدث الهواتف الذكية بأسعار رائعة" },
  { img: "/images/book.jpg", title: "كتاب تعليمي", description: "تعلم البرمجة خطوة بخطوة" },
  { img: "/images/watch.jpg", title: "ساعة يد", description: "تصميم أنيق وعصري" },
  { img: "/images/gift.jpg", title: "هدية خاصة", description: "مناسبة لجميع المناسبات" }
];
    return(
        <section className="donation-section">
            <h2 style={{ fontSize: "25px", fontWeight: "bold",color :"black"}}>منتجات مميزة للتبرع</h2>
            <div style={{
                width: "50px",
                height: "3px",
                backgroundColor: "green",
                margin: "8px auto"
            }}></div>
            <p style={{ fontSize: "22px", color: "#040404ff" }}>تسوق من هذه المنتجات التي يتبرع أصحابها بنسبة 100% من الربح</p>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "20px",
            width: "200px",
            margin: "10px",
            textAlign: "center",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
          }}
        >
          <img
            src={card.img}
            alt={card.title}
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{card.title}</h2>
          <p style={{ fontSize: "14px", color: "#555" }}>{card.description}</p>
        </div>
      ))}
    </div>
        </section>
    );
}

export default Product