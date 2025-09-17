import { useCart } from '../context/CartContext.jsx'; // Named import, not default
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CheckoutForm() {
    const { t, i18n } = useTranslation();
    const {
        cartItems,
        getCartTotal,
        getCartItemsCount,
        validateCart
    } = useCart();

    const navigate = useNavigate();
    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        const form = e.target;
        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const paymentMethod = form.paymentMethod.value;
        const deliveryMethod = form.deliveryMethod.value;

        if (!/^[A-Za-z\s]+$/.test(firstName)) {
            alert(t("checkoutForm.validation.firstNameInvalid"));
            return;
        }
        if (!/^[A-Za-z\s]+$/.test(lastName)) {
            alert(t("checkoutForm.validation.lastNameInvalid"));
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert(t("checkoutForm.validation.emailInvalid"));
            return;
        }
        if (!/^\+?[0-9]{7,15}$/.test(phone)) {
            alert(t("checkoutForm.validation.phoneInvalid"));
            return;
        }
        if (!paymentMethod) {
            alert(t("checkoutForm.validation.paymentMethodRequired"));
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/create-invoice", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    deliveryMethod,
                    paymentMethod,
                    total: getCartTotal(),
                }),
            });

            const data = await response.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                alert(t("checkoutForm.error.paymentCreationFailed"));
            }
        } catch (err) {
            console.error(err);
            alert(t("checkoutForm.error.paymentRequestFailed"));
        }
    };

    useEffect(() => {
        const validation = validateCart();
        if (!validation.isValid) {
            alert(t("checkoutForm.validation.cartInvalid") + validation.message);
            navigate("/shoppingCart");
        }
    }, [navigate, validateCart, t]);

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col justify-center items-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-4xl font-bold mb-6">{t("checkoutForm.title")}</h1>
            <div className="flex flex-row justify-center items-start gap-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 w-[500px] w-[250px]-md w-[90px]-sm h-fit sticky top-6 self-start shadow">
                    <h2 className="text-lg font-semibold mb-4">{t("checkoutForm.orderSummary.title")}</h2>
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{t("checkoutForm.orderSummary.subtotal")}</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{t("checkoutForm.orderSummary.shipping")}</span>
                            <span>{t("checkoutForm.orderSummary.freeShipping")}</span>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-semibold">
                            <span>{t("checkoutForm.orderSummary.total")}</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmitOrder} className="bg-white rounded-lg p-6 shadow-md w-[500px] w-[250px]-md w-[90px]-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.firstName")}
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.lastName")}
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.email")}
                            </label>
                            <input
                                name="email"
                                type="email"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.phone")}
                            </label>
                            <input
                                name="phone"
                                type="tel"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.address")}
                            </label>
                            <input
                                type="text"
                                placeholder={t("checkoutForm.form.addressPlaceholder")}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.zipCode")}
                            </label>
                            <input
                                type="text"
                                placeholder={t("checkoutForm.form.zipCodePlaceholder")}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.city")}
                            </label>
                            <input
                                type="text"
                                placeholder={t("checkoutForm.form.cityPlaceholder")}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <h2 className="text-xl font-semibold mb-4">{t("checkoutForm.form.delivery.title")}</h2>
                            <select name="deliveryMethod" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">{t("checkoutForm.form.delivery.methodPlaceholder")}</option>
                                <option value="home">{t("checkoutForm.form.delivery.home")}</option>
                                <option value="agency">{t("checkoutForm.form.delivery.agency")}</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <h2 className="text-xl font-semibold mb-4">{t("checkoutForm.form.payment.title")}</h2>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <img src="/baridimob.jpeg" alt="Baridi-Mob" className="w-10 h-10" />
                                    <input type="radio" value="Baridi-Mob" name="paymentMethod" className="accent-green-600" />
                                    <span>{t("checkoutForm.form.payment.baridiMob")}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <img src="/cart%20d'or.jpeg" alt="Edahabiya" className="w-10 h-10" />
                                    <input type="radio" value="Edahabiya" name="paymentMethod" className="accent-green-600" />
                                    <span>{t("checkoutForm.form.payment.edahabiya")}</span>
                                </label>
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("checkoutForm.form.payment.cardNumber")}
                            </label>
                            <input
                                type="text"
                                placeholder={t("checkoutForm.form.payment.cardNumberPlaceholder")}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("checkoutForm.form.payment.expirationDate")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("checkoutForm.form.payment.expirationPlaceholder")}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("checkoutForm.form.payment.cvv")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t("checkoutForm.form.payment.cvvPlaceholder")}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors mt-6"
                    >
                        {t("checkoutForm.form.placeOrderButton")} - ${getCartTotal().toFixed(2)}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckoutForm;