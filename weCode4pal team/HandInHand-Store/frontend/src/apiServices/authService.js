import client from "./api.js";

export const loginUser = (email, password) => {
    return client.post("/UserLogin", {
        email: email,
        password: password
    }).then(response => {
        console.log("Login response:", response.data);
        return response;
    }).catch(error => {
        console.error("Login error:", error.response?.data);
        throw error;
    });
};

export const registerUser = (userData) => {
    return client.post("/UserRegistration", userData);
};

export const forgotPassword = (email) => {
    return client.post("/forgot-password", { email })
        .then(res => {
            console.log(res.data);
            return res.data;
        });
};

export const resetPassword = (email, newPassword) => {
    return client.post("/reset-password", { email, newPassword });
};

export const loginAdmin = (email, password) => {
    return client.post("/LoginAdmin", { email, password });
};


export const verifyCode = async (code,email) => {
    try {

        const res = await client.post("/verify-code", {code: code, email: email });

        return res.data; // return backend response { success: true/false, message }
    } catch (error) {
        // optional: normalize error message
        return { success: false, message: error.response?.data?.message || "Server error" };
    }
};

export const deleteUser = async (userId) => {
    return client.delete(`/deleteUser/${userId}`);
};