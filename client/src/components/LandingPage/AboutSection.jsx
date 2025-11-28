import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            About HealthLink
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            A modern healthcare platform connecting doctors and patients
            through secure digital solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-6">
              HealthLink is designed to simplify healthcare management by
              providing a secure platform where doctors can manage patient
              appointments and medical records, while patients can easily
              access their health information and book appointments.
            </p>
            <p className="text-gray-600">
              We focus on creating a seamless experience for both healthcare
              providers and patients through intuitive design and robust
              security measures.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-blue-600 text-3xl mb-2">
                  verified_user
                </span>
                <h4 className="font-semibold text-gray-900">
                  Secure Platform
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Protected medical data storage
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-blue-600 text-3xl mb-2">
                  schedule
                </span>
                <h4 className="font-semibold text-gray-900">
                  Easy Scheduling
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Simple appointment management
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-blue-600 text-3xl mb-2">
                  group
                </span>
                <h4 className="font-semibold text-gray-900">
                  Role-Based Access
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Different portals for each user type
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-blue-600 text-3xl mb-2">
                  clinical_notes
                </span>
                <h4 className="font-semibold text-gray-900">
                  Digital Records
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Electronic health record management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;