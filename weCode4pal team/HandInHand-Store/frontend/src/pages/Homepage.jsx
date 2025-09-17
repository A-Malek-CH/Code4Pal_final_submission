import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import Product from "../components/Product.jsx";
import Footer from "../components/Footer.jsx";
import Beneficiaries from "../components/Beneficiaries.jsx";
import Donates from "../components/Donates.jsx";

const HomePage = () => {
    return (
        <div className="bg-white w-screen">
            <Header />
            <Hero />
            <Card />
            <Product />
            <Donates />
            <Beneficiaries />
            <Footer />
        </div>
    );
};

export default HomePage;
