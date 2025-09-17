import {useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {resetPassword} from "../apiServices/authService.js";


const ResetPassword = () => {
    const { t, i18n } = useTranslation();

    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [language, setLanguage] = useState(i18n.language || "en");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem("language", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(t("error_password_length"));
            setLoading(false);
            return;
        }
        if(!email) {
            setError("Please enter an email address");
            setLoading(false);
            return;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError(t("error_invalid_email"));
            setLoading(false);
            return;
        }
        try{
            await resetPassword(email, password);
            alert("Password reset successfully");
            localStorage.setItem("resetEmail", email);  // save email
            navigate("/login", { state: { email } });
        }catch (error){
            setError("Failed to reset password")+ (error.message ? `: ${error.message}` : "");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl flex flex-col items-center">
                <img
                    src="/key.png"
                    alt="key.png"
                    className="mx-auto mb-2 w-12 h-auto"
                />
                <h1 className="text-3xl font-bold mt-2">{t("reset_password_title")}</h1>
            </div>
            <hr className="my-3" />
            <p className="font-bold text-green-800">{t("verify_code_title")}</p>
            <div className="bg_white p-6 w-full ml-24 mr-24 ">
                <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-300 pt-4">

                  {error && <p className="text-red-500">{error}</p>}
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
                               placeholder={t("email_placeholder")}
                               className="mt-1 block w-full p-2 border border-gray-300 rounded"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                              />
                        </div>
                    <div>
                            <label
                                htmlFor="Password"
                                className={`block text-sm font-medium text-gray-700 mb-1 ${
                                    language === "ar" ? "text-right" : "text-left"
                                }`}
                            >
                                {t("password_label")}
                            </label>
                          <input
                              type="password"
                              placeholder={t("reassure_placeholder")}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                          />
                    </div>
                  <button type="submit"
                  className="bg-green-700 text-white mt-4 px-4 py-2 rounded-2xl w-full"
                  disabled={loading}>
                      {t("reset_button")}
                  </button>
              </form>
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
                    className={`ml-4 mr-4 ${language === "ar" ? "text-emerald-700 font-bold" : "text-gray-700"}`}
                >
                    {t("arabic")}
                </button>
            </div>
            <br />
            <p className="mb-1 border-t border-gray-300 mt-1 pt-4 w-full max-w-md flex flex-row justify-center items-center">
                {t("back_to_login")}
                <span className="text-green-800 ml-1 cursor-pointer"
                      onClick={() =>  {
                          navigate("/login");
                      }}>
                    {t("login_link")}
                </span>
            </p>
        </div>
    );
};
export default ResetPassword;