import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingFor, setLoadingFor] = useState("");
  const navigate = useNavigate();

  const handleButtonClick = (type, path) => {
    setLoading(true);
    setLoadingFor(type);
    
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 1500);
  };

  return (

    
    <div className="flex flex-col min-h-screen">
      {/* Loading Overlay */}
      {loading && (
  <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
    <div className="relative">
      {/* Outer circle */}
      <div className="w-24 h-24 mx-auto border-4 border-gray-200 rounded-full"></div>
      {/* Middle spinning circle - Green color */}
      <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-transparent border-t-[#32cd32] rounded-full animate-spin"></div>
      {/* Inner spinning circle - Lighter green */}
      <div className="absolute inset-2 w-20 h-20 mx-auto border-4 border-transparent border-b-[#32cd32] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
  </div>
)}
      
      <main>
        {/* Header */}

        <Header/>
        {/* Hero Section */}
        <section id="home">
          <section
            className="relative py-20 sm:py-24 lg:py-32 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(17,147,212,0.2), rgba(16,28,34,0.8)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDTxki0lx_1LszYnCkJ-ndkID1Boaqb40zk18brrrzH_Qd7GaQn_o4Q3golF61wGyhhyNe1y8ftssfOcvzDZMB9YsJXN9TxRBX9cK8skd5RZ2MEsEA2o5ympNsDjfNgnwHCOCMEpzXRId2Oo4a-c7k8CW-XInwZlresw5eQPNgh0QBx__WpYZybIjBuGCAoBNwAEJnc1bH_EaQXTPPF__haX0B1wRlQCUrWf1kcglXmm4YLuclQsEgFyqu7OG7p3K-kyO9u79_SYog")',
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Secure Medical Records Management
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
                HealthLink provides a secure platform for doctors and patients
                to manage medical records and appointments efficiently.
              </p>

              {/* HERO BUTTONS */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => handleButtonClick("Admin", "/admin-login")}
                  className="px-6 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      admin_panel_settings
                    </span>
                    Admin Login
                  </span>
                  <div className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>

                <button 
                  onClick={() => handleButtonClick("Doctor", "/doctor-login")}
                  className="px-6 py-3 text-base font-semibold bg-white text-blue-600 hover:bg-gray-100 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 group relative overflow-hidden border-2 border-transparent hover:border-blue-200"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      stethoscope
                    </span>
                    Doctor Login
                  </span>
                  <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>

                <button 
                  onClick={() => handleButtonClick("Patient", "/patient-login")}
                  className="px-6 py-3 text-base font-semibold bg-white text-blue-600 hover:bg-gray-100 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 group relative overflow-hidden border-2 border-transparent hover:border-blue-200"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>
                    Patient Login
                  </span>
                  <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>

              {/* Additional signup button with different animation */}
              <div className="mt-6">
                <button 
                  onClick={() => handleButtonClick("Sign Up", "/signup")}
                  className="px-8 py-4 text-lg font-semibold  from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">
                      rocket_launch
                    </span>
                    Get Started - Create Your Account
                  </span>
                  <div className="absolute inset-0 from-emerald-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  {/* Shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 from-transparent to-white opacity-30 group-hover:animate-shine transition-all duration-1000"></div>
                </button>
              </div>
            </div>
          </section>
        </section>

        

        {/* About Section */}
        <AboutSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Add custom animation for shine effect */}
      <style jsx>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;