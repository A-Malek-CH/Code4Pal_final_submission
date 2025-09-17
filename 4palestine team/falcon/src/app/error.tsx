"use client";

import React from 'react';
import Link from 'next/link';

interface ErrorPageProps {
    errorCode?: number;
    errorMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode = 500, errorMessage = "Something went wrong." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">{errorCode}</h1>
            <h2 className="text-2xl font-semibold mb-6">Error</h2>
            <p className="text-lg mb-8">{errorMessage}</p>
            <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;