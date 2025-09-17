import React, { useEffect, useState } from 'react';
import {
    Package, PlusCircle, Search, Eye, Edit, Trash2,
    CheckCircle, Hourglass, DollarSign, Boxes
} from 'lucide-react';
import SidebarComponent from "../components/SidebarComponent.jsx";
import client from "../apiServices/api.js";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductsDashboard = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [statsValue, setStatsValue] = useState({
        totalProducts: 0,
        soldProducts: 0,
        pendingReview: 0,
        totalDonations: 0
    });

    const filteredProducts = products.filter(product =>
        (product.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(product.categories)
                ? product.categories.join(", ")
                : (product.categories || "")
        ).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


    useEffect(() => {
        getProducts();
    }, );

    async function getProducts() {
        const userId = localStorage.getItem('userId');

        try {
            const res = await client.get(`api/users/${userId}/products`);
            setProducts(Array.isArray(res.data) ? res.data : []);

            setStatsValue({
                totalProducts: res.data.length,
                soldProducts: res.data.filter(p => p.status === "sold").length,
                pendingReview: res.data.filter(p => p.status === "pending").length,
                totalDonations: res.data
                    .filter(p => p.status === "sold")
                    .reduce((sum, p) => sum + (p.price || 0), 0)
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleDeleteProduct = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) {
            try {
                const res = await client.delete(`Delete-Product/${id}`);
                setProducts(res.data);
                alert('تم حذف المنتج بنجاح!');
            } catch (e) {
                console.error('Error deleting product:', e);
                alert('حدث خطأ أثناء حذف المنتج.');
            }
        }
    };

    const handleViewProduct = async (product) => {
       try{
           navigate(`/DisplayProduct/${product.id}`, {state: {product}});
       }catch(err){
           console.error("❌ API Error:", err);
       }
    };

    const handleEditProduct = async (product) => {
        try{
            navigate(`/UpdateProductPage/${product.id}`, {state: {product}});
        }catch(err){
            console.error("❌ API Error:", err);
        }
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            available: { text: "متاح", class: "bg-green-100 text-green-800" },
            sold: { text: "مباع", class: "bg-red-100 text-red-800" },
            pending: { text: "في انتظار المراجعة", class: "bg-yellow-100 text-yellow-800" }
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.class || statusConfig.available.class}`}>
                {statusConfig[status]?.text || statusConfig.available.text}
            </span>
        );
    };

    const stats = [
        { label: t("productsDashboard.stats.totalProducts"), value: statsValue.totalProducts, icon: <Boxes />, color: "blue" },
        { label: t("productsDashboard.stats.pendingReview"), value: statsValue.soldProducts, icon: <CheckCircle />, color: "green" },
        { label: t("productsDashboard.stats.soldProducts"), value: statsValue.pendingReview, icon: <Hourglass />, color: "yellow" },
        { label: t("productsDashboard.stats.totalDonations"), value: `$${statsValue.totalDonations}`, icon: <DollarSign />, color: "red" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex w-screen"
             dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <SidebarComponent />

            <main className="flex-1 mr-64 p-8">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                        {t("productsDashboard.title")}
                        <div className="absolute -bottom-3 right-1/2 transform translate-x-1/2 w-24 h-1 bg-green-600 rounded"></div>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6">
                        {t("productsDashboard.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                                    stat.color === 'red' ? 'bg-red-100 text-red-600' :
                                        stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                            }`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{String(stat.value)}</div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{t("AllProducts")}</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t("productsDashboard.searchPlaceholder")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-3 focus:ring-green-100"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                            <a
                                href="/AddProduct"
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>{t("productsDashboard.addProductButton")}</span>
                            </a>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t("productsDashboard.tableHeaders.product")}</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t("productsDashboard.tableHeaders.category")}</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t("productsDashboard.tableHeaders.price")}</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t("productsDashboard.tableHeaders.status")}</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t("productsDashboard.tableHeaders.date")}</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t("productsDashboard.tableHeaders.actions")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden">
                                                <img
                                                    src={Array.isArray(product.images) ? product.images.map(i => i.imageUrl) : ""}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{product.title}</div>
                                                <div className="text-sm text-gray-600">
                                                    {Array.isArray(product.categories) ? product.categories.map(c => c.name).join(", ") : product.categories?.name||product.categories||""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-700">
                                        {Array.isArray(product.categories) ? product.categories.map(c => c.name).join(", ") : product.categories?.name||product.categories||""}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="font-bold text-gray-900">${product.fixedPrice}</div>
                                        <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-block mt-1">
                                            {product.priceType}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={product.status} />
                                    </td>
                                    <td className="px-4 py-4 text-gray-700">{product.createdAt}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewProduct(product)}
                                                className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                                                title="عرض"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"
                                                title="تعديل"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    currentPage === i + 1
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ProductsDashboard;
