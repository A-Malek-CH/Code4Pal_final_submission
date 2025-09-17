import {createContext, useEffect, useState} from "react";
import {loginUser, registerUser} from "../apiServices/authService.js";
import client from "../apiServices/api.js";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogin = async (credentials) => {
        try {
            const response = await loginUser(credentials.email, credentials.password);
            const user = response.data;

            if (user && user.id) {
                setUser(user);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("userEmail", user.email);
                return { success: true, user };
            }

            return { success: false, message: "Invalid credentials" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const handleRegister = async (credentials) => {
        try{
            const response = await registerUser(credentials);
            return response.data;
        }catch(error){
            return {success: false, message: error.response?.data?.message || "Register failed"};
        }
    };

    const handlLogOut = () => {
      setUser(null);
      localStorage.removeItem("user", JSON.stringify(user));

    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            client
                .get(`/getUserById?id=${userId}`)
                .then((res) => setUser(res.data))
                .catch((err) => console.log(err))
                .finally(() => setLoading(false)); // ✅ always stop loading
        } else {
            setLoading(false);
        }
    }, []);

    return (
      <AuthContext.Provider value={
          {
              user,
              isAuthenticated: !!user,
              loading,
              handleLogin,
              handleRegister,
              handlLogOut,
          }
      }
      >
          {children}
      </AuthContext.Provider>
    );
};
export default AuthContext;
