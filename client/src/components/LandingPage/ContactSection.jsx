import React from "react";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Contact Us
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Get in touch with our team for any questions or support
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-600 mt-1">
                  location_on
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Address</h4>
                  <p className="text-gray-600">
                    Berhampur
                    <br />
                    Ganjam, Odisha{" "}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-600 mt-1">
                  call
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">
                    +91 9334585634 HELP
                    <br />
                    +91 9334585635 SUPPORT
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-600 mt-1">
                  mail
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">
                    support@healthlink.com
                    <br />
                    info@healthlink.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-600 mt-1">
                  schedule
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Business Hours
                  </h4>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 8:00 PM
                    <br />
                    Saturday: 9:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;