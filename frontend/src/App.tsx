import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StripeWrapper from './stripe/StripeWrapper'
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import ProtectRoute from './pages/auth/ProtectRoute';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <StripeWrapper>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/about" element={<About />}></Route>
              <Route path="/account" element={<ProtectRoute><Account /></ProtectRoute>} />
              <Route path="/cart" element={<ProtectRoute><Cart /></ProtectRoute>} />
              <Route path="/success" element={<ProtectRoute><Success /></ProtectRoute>} />
              <Route path="/cancel" element={<ProtectRoute><Cancel /></ProtectRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </StripeWrapper>
    </BrowserRouter>
  );
}

export default App;
