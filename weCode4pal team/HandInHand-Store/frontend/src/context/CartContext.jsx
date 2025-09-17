import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initialization
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // check stock
                if (existingItem.quantity + quantity > product.stockQuantity) {
                    alert("❌ الكمية المطلوبة غير متوفرة");
                    return prevItems;
                }
                // If item already exists, update quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                if (quantity > product.stockQuantity) {
                    alert("❌ الكمية المطلوبة غير متوفرة");
                    return prevItems;
                }
                // If new item, add to cart
                return [...prevItems, { ...product, quantity }];
            }
        });
    };
    {/*
    const getDonationTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                total +
                ((item.donationPercentage || 0) / 100) * item.price * item.quantity,
            0
        );
    };*/}

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.fixedPrice * item.quantity), 0);
    };

    const getCartItemsCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const validateCart = () => {
        const errors = [];

        // 1. Check if cart is empty
        if (!cartItems || cartItems.length === 0) {
            errors.push({
                type: 'EMPTY_CART',
                message: 'Your cart is empty'
            });
            return { isValid: false, errors };
        }

        // 2. Check each item for basic validity
        cartItems.forEach((item, index) => {
            // Check if item has required fields
            if (!item.id || !item.title || !item.fixedPrice || !item.quantity) {
                errors.push({
                    type: 'INVALID_ITEM',
                    message: `Item at position ${index + 1} is missing required information`,
                    itemIndex: index
                });
            }

            // Check if quantity is valid
            if (item.quantity <= 0) {
                errors.push({
                    type: 'INVALID_QUANTITY',
                    message: `"${item.title}" has invalid quantity`,
                    itemId: item.id
                });
            }

            // Check if price is valid
            if (item.fixedPrice <= 0) {
                errors.push({
                    type: 'INVALID_PRICE',
                    message: `"${item.title}" has invalid price`,
                    itemId: item.id
                });
            }
        });

        // 3. Calculate total and check if reasonable
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (total <= 0) {
            errors.push({
                type: 'INVALID_TOTAL',
                message: 'Cart total must be greater than zero'
            });
        }

        return {
            isValid: errors.length === 0,
            errors,
            total
        };
    };
    // Helper function to show validation errors to user
    const displayValidationErrors = (errors) => {
        return (
            <div className="validation-errors">
                {errors.map((error, index) => (
                    <div key={index} className={`alert ${getAlertClass(error.type)}`}>
                        {error.message}
                    </div>
                ))}
            </div>
        );
    };

    const getAlertClass = (errorType) => {
        switch (errorType) {
            case 'PRICE_CHANGED':
            case 'INSUFFICIENT_STOCK':
            case 'QUANTITY_EXCEEDED':
                return 'alert-warning';
            case 'OUT_OF_STOCK':
            case 'PRODUCT_NOT_FOUND':
            case 'PRODUCT_INACTIVE':
                return 'alert-error';
            default:
                return 'alert-info';
        }
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        getItemQuantity,
        validateCart,
        displayValidationErrors
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
