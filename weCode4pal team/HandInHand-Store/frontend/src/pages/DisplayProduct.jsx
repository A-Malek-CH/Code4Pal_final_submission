import React, {useEffect, useState} from "react";
import DisplayProductDetails from "../components/DisplayProductDetails.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const DisplayProduct = () => {
    const { state } = useState();
    const {productId} = useParams();
    const [product, setProduct] = useState(state?.product || null);
    const [err, setError] = useState("");

    useEffect(() => {
        if(!product && productId) {
        axios
            .get("http://localhost:8080/products/getById", { params: { id: productId } })
            .then((response) => {
                console.log("✅ API Response:", response);
                console.log("✅ Response Data:", response.data);

                setProduct(response.data);
            })
            .catch((err)=>{
                console.error("❌ API Error:", err);
                setError("Could not get product")+(err.message ? `: ${err.message}` : "");
            });
        }
    }, [product,productId]);

    if(err) return <p className="text-red-600">{err}</p>;

    return (
        <div className="bg-white w-screen">
          <Header/>
          <DisplayProductDetails product={product} />
          <Footer/>
        </div>
    );
}
export default DisplayProduct;