import React from "react";

const FeaturesSection = () => {
  const doctorFeatures = [
    "Patient appointment management",
    "Prescription writing",
    "Patient record access",
    "Appointment approvals"
  ];

  const patientFeatures = [
    "Book appointments online",
    "View medical prescriptions",
    "Manage personal information",
    "Track appointment status"
  ];

  const securityFeatures = [
    "Secure user authentication",
    "Role-based access control",
    "Password reset functionality",
    "Protected data storage"
  ];

  const keyFeatures = [
    {
      icon: "folder_shared",
      title: "Medical Records",
      text: "Secure storage and management of patient health records",
    },
    {
      icon: "event_available",
      title: "Appointments",
      text: "Book and manage appointments between doctors and patients",
    },
    {
      icon: "prescription",
      title: "Prescriptions",
      text: "Digital prescription management and tracking",
    },
    {
      icon: "admin_panel_settings",
      title: "Admin Dashboard",
      text: "Complete system management and user oversight",
    },
  ];

  const FeatureCard = ({ icon, title, items, bgColor, textColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className={`flex items-center justify-center h-12 w-12 mx-auto rounded-full ${bgColor} ${textColor} mb-4`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-4">{title}</h3>
      <ul className="space-y-3 text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="material-symbols-outlined text-green-500 mr-3 text-sm">
              check_circle
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Platform Features
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Everything you need for efficient healthcare management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="stethoscope"
            title="For Doctors"
            items={doctorFeatures}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <FeatureCard
            icon="person"
            title="For Patients"
            items={patientFeatures}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <FeatureCard
            icon="security"
            title="Security & Access"
            items={securityFeatures}
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
        </div>

        {/* KEY FEATURES GRID */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {keyFeatures.map((feature) => (
            <div key={feature.title} className="text-center p-4">
              <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="material-symbols-outlined text-3xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;