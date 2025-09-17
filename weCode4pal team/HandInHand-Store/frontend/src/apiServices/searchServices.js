import client from './api';

export const searchProduct = (keyword) => {
    return client.get(`/products/search?keyword=${encodeURIComponent(keyword)}`);
};

export const getAllCategories = () => {
    return client.get("/api/categories/get/all");
};

export const getProductsByCategory = (categoryId) => {
    return client.get(`/products/category/${categoryId}`);
};