import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

const CheckoutProduct = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setError] = useState("");

    useEffect(() => {
        setIsLoading(true);
        axios
        .get("http://localhost:8080/products/getById", { params: { id: productId } })
            .then((response) => {
                console.log("✅ API Response:", response);
                console.log("✅ Response Data:", response.data);

                setProduct(response.data);
                setIsLoading(false);
            })
            .catch((err)=>{
                console.error("❌ API Error:", err);              // log the error object
            setError("Could not get product")+(err.message ? `: ${err.message}` : "");
            setIsLoading(false);
        });
    }, [productId]);

    if(isLoading) return <p>"Still Loading"</p>;
    if(err) return <p className="text-red-600">{err}</p>;

    return (
      <div className="bg-white w-screen">
          <Header />
          <ProductDetails  product={product} />
          <Footer />
      </div>
    );
}

export default CheckoutProduct;