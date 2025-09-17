import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useNavigate} from 'react-router-dom';
import {loginAdmin} from "../apiServices/authService.js";

const Login = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [language, setLanguage] = useState(i18n.language || 'en');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => {
            console.log("Language changed");
        });
        setLanguage(lng);
        localStorage.setItem('language', lng);
        document.documentElement.setAttribute('dir', lng === "ar" ? 'rtl' : 'ltr');
    };

    useEffect(() => {
        document.documentElement.setAttribute('dir', language === "ar" ? 'rtl' : 'ltr');
    }, [language]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!email.trim()) {
            setError(t('error_email_required'));
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t('error_invalid_email'));
            setLoading(false);
            return;
        }
        if (!password.trim()) {
            setError(t('error_password_required'));
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(t('error_password_length'));
            setLoading(false);
            return;
        }

        try {
            const response = await loginAdmin({email,password});
            console.log(response.data);
            navigate("/dashboard");
        } catch (err) {
            setError(t('error_login_failed') + (err.message ? `: ${err.message}` : ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl min-h-fit flex flex-col items-center justify-center pt-6 pb-4 space-y-1">
            <div className="w-full max-w-3xl flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mt-1">{t('admin_login_title')}</h2>
            </div>

            <hr className="my-3" />
            <div className="bg_white p-6 w-full ml-24 mr-24 ">
                <form className="space-y-3 border-t border-gray-300 pt-2"
                      onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                            {t('email_label')}
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder={t('email_placeholder')}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                            {t('password_label')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder={t('password_placeholder')}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-green-700 text-white mt-4 px-4 py-2 rounded-[20px] w-full"
                        disabled={loading}
                    >
                        {loading ? t('loading') : t('login_button')}
                    </button>
                </form>
            </div>
            <a href="" className="text-gray-800 mt-2">{t('forgot_password')}</a>
            <div className="w-3/4 flex flex-row items-center justify-center border-t border-gray-300 mt-2 pt-2">
                <button
                    type="button"
                    onClick={() => changeLanguage('en')}
                    className={`mr-4 ml-4 mb-2 ${language === 'en' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}
                >
                    {t('english')}
                </button>
                <button
                    type="button"
                    onClick={() => changeLanguage('ar')}
                    className={`mr-4 ml-4 mb-1 ${language === 'ar' ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}
                >
                    {t('arabic')}
                </button>
            </div>
        </div>
    );
};

export default Login;