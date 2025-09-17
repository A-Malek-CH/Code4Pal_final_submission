import axios from "axios";

 const client = axios.create({
    baseURL: "http://localhost:8080", // replace when you know
    headers: {
        "Content-Type": "application/json"
    }
});
export default client;