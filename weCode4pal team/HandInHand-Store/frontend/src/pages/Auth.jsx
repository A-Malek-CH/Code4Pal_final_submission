import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";

const Auth = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.replace("/", "")||"login";

    const [action, setAction] = useState(currentPath);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [language, setLanguage] = useState(i18n.language || "en");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {handleLogin} = useContext(AuthContext);
    const {handleRegister} = useContext(AuthContext);


    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem("language", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    };

    const handlLogin = async () => {
        if(!email.trim()){
            setError(t("error_email_required"));
            setLoading(false);
            return;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError(t("error_invalid_email"));
            setLoading(false);
            return;
        }
        if(!password.trim()){
            setError(t("error_password_required"))
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t("error_password_length"));
            setLoading(false);
            return;
        }

        try {
            console.log("Attempting login with:", { email, password });
            const result = await handleLogin({ email, password });
            console.log("Login result:", result);

            if (result.success) {
                navigate("/"); // or wherever you want
            } else {
                setError(result.message || "Invalid credentials");
            }
        } catch (error) {
            setError("Server error: " + error.message);
        }
    };

    const handlRegisteration = async () => {
        if(!username.trim()){
            setError(t("error_username_required"));
            setLoading(false);
            return;
        }
        if(!email.trim()){
            setError(t("error_email_required"));
            setLoading(false);
            return;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError(t("error_invalid_email"));
            setLoading(false);
            return;
        }
        if(!phoneNumber.trim()){
            setError(t("error_phone_required"));
            setLoading(false);
            return;
        }
        if(!password.trim()){
            setError(t("error_password_required"));
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(t("error_password_length"));
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError(t("error_password_mismatch"));
            setLoading(false);
            return;
        }
        try{
            const response = await handleRegister({username,
            email,
            password,
            confirmPassword,
            phoneNumber});
            console.log(response.data);
            navigate("/dashboard");
        }catch(error){
            setError(`Sever error occured: ${error.message}`);
        }
    }

    useEffect(() => {
        setError("");
    },[action]);

    useEffect(() => {
        document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    }, [language]);

    useEffect(() => {
        setAction(currentPath);
    }, [currentPath]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);


        if(action === "login"){
            await handlLogin();

        }else if(action === "register"){

            await handlRegisteration();

        }
        setLoading(false);
    };


    return(
        <div className="bg-white rounded-2xl min-h-fit flex flex-col items-center justify-center space-y-1 pt-1 pb-2 mt-auto    ">
            <div className="w-full max-w-3xl flex flex-col items-center">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center mt-2">
                    {action === "login"
                        ? t("login_title")
                        : action === "register"
                            ? t("register_title") : ""}
                </h1>
            </div>

            <hr className="my-3" />
            {action === "register" ? <p className="font-bold text-green-800">{t("register_p")}</p> :
                <p className="font-bold text-green-800">{t("login_p")}</p>}
            <div className="bg_white p-6 w-full ml-24 mr-24 ">
                <form className="space-y-3 border-t border-gray-300 pt-2"
                onSubmit={handleSubmit}>
                    {action === "register" && (
                        <div>
                            <label
                                htmlFor="username"
                                className={`block text-sm font-medium text-gray-700 mb-1 ${
                                    language === "ar" ? "text-right" : "text-left"
                                }`}>
                                {t("username_label")}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder={t("username_placeholder")}
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className={`block text-sm font-medium text-gray-700 mb-1 ${
                                language === "ar" ? "text-right" : "text-left"
                            }`}
                        >
                            {t("email_label")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder={t("email_placeholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {action === "register" &&(
                        <div>
                            <label
                                htmlFor="phone"
                                className={`block text-sm font-medium text-gray-700 mb-1 ${
                                    language === "ar" ? "text-right" : "text-left"
                                }`}
                            >
                                {t("phone_label")}
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder={t("phone_placeholder")}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="password"
                            className={`block text-sm font-medium text-gray-700 mb-1 ${
                                language === "ar" ? "text-right" : "text-left"
                            }`}
                        >
                            {t("password_label")}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder={t("password_placeholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {action === "register" ? (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className={`block text-sm font-medium text-gray-700 mb-1 ${
                                    language === "ar" ? "text-right" : "text-left"
                                }`}
                            >
                                {t("reassure_password_label")}
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder={t("reassure_placeholder")}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    ):"" }

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-green-700 text-white mt-4 px-4 py-2 rounded-[20px] w-full"
                        disabled={loading}
                    >
                        {loading
                            ? t("loading")
                            : action === "login"
                                ? t("login_button")
                                : action === "register"
                                    ? t("register_button") : ""}
                    </button>

                </form>

                <br/>
                {action === "login" && (
                    <span className="text-gray-700 font-bold text-sm mt-1 cursor-pointer flex flex-col justify-center items-center"
                    onClick={() => navigate("/forgot_password")}
                    >
                        {t("forgot_password")}
                    </span>
                )}

            </div>

            <div className="w-3/4 flex flex-row items-center justify-center">
                <button
                    type="button"
                    onClick={() => changeLanguage("en")}
                    className={`ml-4 mr-4 ${language === "en" ? "text-emerald-700 font-bold" : "text-gray-700"}`}
                >
                    {t("english")}
                </button>
                <button
                    type="button"
                    onClick={() => changeLanguage("ar")}
                    className={`mr-4 ml-4 ${language === "ar" ? "text-emerald-700 font-bold" : "text-gray-700"}`}
                >
                    {t("arabic")}
                </button>
            </div>
            <br />
            <p className="mb-1 border-t border-gray-300 mt-1 pt-4 w-full max-w-md flex flex-row justify-center items-center">
                {action === "login" ? t("no_account") :
                    action === "register" ? t("have_account"): " "}{" "}
                <span
                    className="text-green-800 ml-1 cursor-pointer"
                    onClick={() =>  {
                        navigate(action === "login" ? "/register" : "/login");
                    }}
                >
                    ({action === "login" ? t("register_link") : t("login_link")})
                </span>
            </p>
        </div>
    );
};

export default Auth;