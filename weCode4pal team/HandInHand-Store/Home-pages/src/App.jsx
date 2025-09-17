import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Product from './components/Product.jsx';
import Card from './components/Card.jsx';
import Donates from './components/Donates.jsx';
import Beneficiaries from './components/Beneficiaries.jsx';

import Auth from './components/Auth.jsx';

function App() {
    return(
        <>
        <Header />
          <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/card" element={<Card />} />
              <Route path="/products" element={<Product />} />
              <Route path="/donates" element={<Donates />} />
              <Route path="/beneficiaries" element={<Beneficiaries />} />

              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />

              {/* Redirect unknown paths to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        <Footer />
        </>
    );
}

export default App
