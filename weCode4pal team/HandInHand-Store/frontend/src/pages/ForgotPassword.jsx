import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {forgotPassword} from "../apiServices/authService.js";


const ForgotPassword = () => {
    const { t, i18n } = useTranslation();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [language, setLanguage] = useState(i18n.language || "en");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        localStorage.setItem("language", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!email) {
            setError("Please enter an email address");
            setLoading(false);
            return;
        }
        try{
            await forgotPassword(email);
            alert("Code sent to your email");
            localStorage.setItem("resetEmail", email);  // save email
            navigate("/verifyCode", { state: { email } });

        }catch(error){
            setError("Failed to send code to your email")+(error.message ? `: ${error.message}` : "");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl min-h-fit flex flex-col items-center justify-center pb-8 pt-10 pr-4 pl-4">
            <div className="w-full max-w-3xl flex flex-col items-center">
                <img src="mail.png"
                     alt="mail.img"
                     className="mx-auto mb-2 w-12 h-auto"/>
                <h2 className="font-bold mb-4 !text-4xl">{t("forgot_password_title")}</h2>
            </div>
            <hr className="my-3" />
            <p className="font-bold text-green-800">{t("reset_sent_message")}</p>
            <div className="bg_white p-6 w-full ml-24 mr-24 ">
                <form className="space-y-4 border-t border-gray-300 pt-4"
                      onSubmit={handleSubmit}>

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
                    <button type="submit"
                            className="bg-green-700 text-white mt-4 px-4 py-2 rounded-2xl w-full"
                            disabled={loading}
                            onClick={()=>{navigate("/verifyCode")}}>
                        {t("reset_button_")}
                    </button>
                </form>
            </div>
            <br/>
            <div className="w-3/4 flex flex-row items-center justify-center">
                <button
                    type="button"
                    onClick={() => changeLanguage("en")}
                    className={`mr-4 ml-4 ${language === "en" ? "text-emerald-700 font-bold" : "text-gray-700"}`}
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
                {t("back_to_login")}
                <span className="text-green-800 ml-1 cursor-pointer">
                    {t("login_link")}
                </span>
            </p>
        </div>

    );
};
export default ForgotPassword;