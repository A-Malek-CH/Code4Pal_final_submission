import Header from "../components/Header.jsx";
import ShoppingCart from "../components/ShoppingCart.jsx";
import {useTranslation} from "react-i18next";

const CartPage = () => {
    const {t,i18n} = useTranslation();
    return(
        <div className="bg-white w-screen flex flex-col min-h-screen"
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>

            <Header />
            <div className="bg-gray-100 flex-1">
                <h1 className="text-center text-4xl font-extrabold tracking-wide m-3">
                    {t("Shopping_Cart")}
                </h1>
                <ShoppingCart />
            </div>
        </div>
    );
}

export default CartPage;