import React from "react";
import { Link } from "react-router-dom";

const BookingSuccess = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-background-dark rounded-xl shadow-lg overflow-hidden relative">
          {/* ❌ Close Button (Optional) */}
          <Link to="/patient-dashboard">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>

          {/* ✅ Success Section */}
          <div className="p-8 md:p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-8 w-8 text-green-500 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 12.75l6 6 9-13.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-black  mb-2">
              Appointment Booked Successfully!
            </h2>
            <p className="text-gray-600  mb-8">
              Your appointment with <b>Dr. Emily Carter</b> has been scheduled.
            </p>

            {/* ✅ Appointment Details */}
            <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-black mb-4">
                Appointment Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="text-sm font-medium text-black ">
                    Dr. Emily Carter
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium text-black ">
                    July 15, 2024
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-sm font-medium text-black ">2:00 PM</p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-black text-right">
                    HealthFirst Clinic, 123 Medical Plaza, Anytown
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Reminder */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Please arrive 15 minutes prior to your appointment for check-in.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
