import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const Footer = () => {

  const {isAuthenticated} = useAuth();
  return (
    <footer className="bg-[#1f2937] text-gray-200">
      <div className="container mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3 text-white">📚 BookStore</h3>
          <p className="text-sm text-gray-400">
            Your go-to place for discovering amazing books at great prices.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline hover:text-yellow-400">Home</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline hover:text-yellow-400">Cart</Link>
            </li>
            {(isAuthenticated) ? 
            <li>
              <Link to="/account" className="hover:underline hover:text-yellow-400">Account</Link>
            </li>
            : <></>
            }
            <li>
              <Link to="/about" className="hover:underline hover:text-yellow-400">About</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 text-white">Contact Us</h3>
          <p className="text-sm text-gray-400">✉️ support@bookstore.com</p>
          <p className="text-sm text-gray-400">📞 +91 9511757691</p>
        </div>
      </div>

      <div className="bg-[#111827] py-4 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} BookStore. All rights reserved.</p>
        <div className="mt-2 flex justify-center items-center gap-2 text-center text-sm" style={{opacity:"0.2"}}>
          <span>Made with</span>
          <HeartIcon className="h-5 w-5 text-red-500 animate-pulse" />
          <span>and</span>
          <span className="text-yellow-500 text-lg">☕</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
