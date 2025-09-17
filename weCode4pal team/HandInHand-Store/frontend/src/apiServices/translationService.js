import axios from "axios";

export const translateText = async (text, sourceLang, targetLang) => {
    const res = await axios.post("http://localhost:5000/translate", {
        text,
        sourceLang,
        targetLang,
    });
    return res.data.translatedText;
};
