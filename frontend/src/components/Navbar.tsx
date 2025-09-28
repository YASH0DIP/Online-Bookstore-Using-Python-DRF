import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon  } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [ isSidebarOpen, setSidebarOpen ] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-slate-100 shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600">
          BookStore
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex md:space-x-6 text-gray-700 text-sm md:text-base">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/cart" className="hover:text-blue-600">Cart</Link>
          {isAuthenticated && <Link to="/account" className="hover:text-blue-600">Account</Link>}

          {isAuthenticated ? (
            <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-800" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden bg-slate-100 shadow-lg p-4 space-y-4 text-gray-700 text-base">
          <Link to="/" onClick={toggleSidebar} className="block">Home</Link>
          <Link to="/about" className="block">About</Link>
          <Link to="/cart" onClick={toggleSidebar} className="block">Cart</Link>
          {isAuthenticated && (
            <Link to="/account" onClick={toggleSidebar} className="block">Account</Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                toggleSidebar();
              }}
              className="block text-left text-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={toggleSidebar} className="block">Login</Link>
              <Link to="/register" onClick={toggleSidebar} className="block">Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
