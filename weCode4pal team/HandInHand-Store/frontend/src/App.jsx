import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Login from "./pages/Login.jsx";
import Homepage from "./pages/Homepage.jsx";
import CheckoutProduct from "./pages/CheckoutProduct.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import CartPage from "./pages/CartPage.jsx";
import ShoppingPage from "./pages/ShoppingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CheckoutPage from "./pages/checkoutPage.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ProductsDashboard from "./pages/ProductsDashboard.jsx";
import Donations from './pages/Donations.jsx';
import DisplayProduct from "./pages/DisplayProduct.jsx";
import UpdateProductPage from "./pages/UpdateProductPage.jsx";




function App() {
      return (
            <div className="App">
                    <Routes>

                          {/* Auth routes */}
                          <Route path="/login" element={<Auth />} />
                          <Route path="/register" element={<Auth />} />
                          <Route path="/forgot_password" element={<ForgotPassword />} />
                          <Route path="/verifyCode" element={<VerifyCode />} />
                          <Route path="/reset_password" element={<ResetPassword />} />
                          <Route path="/login_admin" element={<Login/> }/>

                          <Route path="/" element={<Homepage />} />
                          <Route path="/checkoutProduct/:productId" element={<CheckoutProduct />} />
                          <Route path="/shopingCart" element={<CartPage />}/>
                          <Route path="/shoppingPage" element={<ShoppingPage />} />
                          <Route path="/profilePage" element={<ProfilePage />} />
                          <Route path="/checkoutPage" element={<CheckoutPage />} />
                          <Route path="/AddProduct" element={<AddProduct />} />
                          <Route path="/ProductsDashboard" element={<ProductsDashboard />} />

                          <Route path="/donations" element={<Donations />} />

                          <Route path="/DisplayProduct/:productId" element={<DisplayProduct />} />
                          <Route path="/UpdateProductPage/:productId" element={<UpdateProductPage />} />


                          {/* Redirect unknown paths to home */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
            </div>
      );
}

export default App;
