import Header from "../components/Header";
import CheckoutForm from "../components/CheckoutForm.jsx";


const checkoutPage = () => {
    return (
        <div className="bg-white w-screen min-h-screen">
            <Header />
            <CheckoutForm />
        </div>
    );
}
export default checkoutPage;