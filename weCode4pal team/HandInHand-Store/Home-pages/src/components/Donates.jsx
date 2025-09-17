import "./Donates.css"

function Donates(){

    const stats = [
    { value: "$124,850", label: "إجمالي التبرعات" },
    { value: "5,200+", label: "عائلة مستفيدة" },
    { value: "18", label: "مشروع ممول" },
    { value: "100%", label: "شفافية" },
  ];
    return(
        <section className="principle">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Bloc texte au-dessus */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "25px", fontWeight: "bold",color :"white"}}>تأثير تبرعاتكم</h2>
                    <div style={{
                        width: "50px",
                        height: "3px",
                        backgroundColor: "green",
                        margin: "8px auto"
                    }}></div>
                    <p style={{ fontSize: "22px", color: "white" }}>
                    احصائيات حقيقية عن الفرق الذي تصنعونه
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

export default Donates