import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-white h-8 w-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">HealthLink</h2>
            </div>
            <p className="text-gray-400">
              Secure medical records management for doctors and patients.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Access Portal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/doctor-login" className="hover:text-white transition-colors">
                  Doctor Login
                </Link>
              </li>
              <li>
                <Link to="/patient-login" className="hover:text-white transition-colors">
                  Patient Login
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 HealthLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;