import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="text-blue-600 h-8 w-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black">HealthLink</h2>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* BUTTONS 
          <div className="flex items-center gap-3">
            <Link to="/signup">
              <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200">
                Sign Up
              </button>
            </Link>
          </div>
          */}
        </div>
      </div>
    </header>
  );
};

export default Header;