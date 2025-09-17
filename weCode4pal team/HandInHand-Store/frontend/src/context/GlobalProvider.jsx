
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
// import other providers as needed

const GlobalProvider = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>
                {/* Add more providers here */}
                {children}
            </CartProvider>
        </AuthProvider>
    );
};

export default GlobalProvider;
