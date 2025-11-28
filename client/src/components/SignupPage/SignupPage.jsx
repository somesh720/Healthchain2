import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    age: "",
    bloodgroup: "",
    gender: "",
    specialization: "",
    experience: "",
    consultationFee: "",
    consultingDays: [],
    consultingTimings: {
      startTime: "",
      endTime: ""
    }
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address!";
        } else {
          delete errors.email;
        }
        break;
        
      case "password":
        if (value.length < 6) {
          errors.password = "Password must be at least 6 characters long!";
        } else {
          delete errors.password;
        }
        break;
        
      case "confirmPassword":
        if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match!";
        } else {
          delete errors.confirmPassword;
        }
        break;
        
      case "phone":
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          errors.phone = "Phone number must be exactly 10 digits!";
        } else {
          delete errors.phone;
        }
        break;
        
      case "age":
        if (formData.role === "patient" && value) {
          const age = parseInt(value);
          if (age < 1 || age > 120) {
            errors.age = "Please enter a valid age (1-120)!";
          } else {
            delete errors.age;
          }
        }
        break;
        
      case "consultationFee":
        if (formData.role === "doctor" && value) {
          const fee = parseInt(value);
          if (fee < 0) {
            errors.consultationFee = "Consultation fee cannot be negative!";
          } else {
            delete errors.consultationFee;
          }
        }
        break;
        
      case "zipCode":
        if (value && value.length !== 6) {
          errors.zipCode = "Zip code must be exactly 6 digits!";
        } else {
          delete errors.zipCode;
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(errors);
  };

  const validateForm = () => {
    const errors = {};
    
    // Required field validation
    if (!formData.role) errors.role = "Please select a role!";
    if (!formData.fullName) errors.fullName = "Full name is required!";
    if (!formData.email) errors.email = "Email is required!";
    if (!formData.password) errors.password = "Password is required!";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password!";
    if (!formData.phone) errors.phone = "Phone number is required!";
    if (!formData.gender) errors.gender = "Please select gender!";
    if (!formData.address) errors.address = "Address is required!";
    if (!formData.city) errors.city = "City is required!";
    if (!formData.state) errors.state = "State is required!";
    if (!formData.zipCode) errors.zipCode = "Zip code is required!";

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match!";
    }

    // Password strength validation
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long!";
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits!";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address!";
    }

    // Age validation for patient
    if (formData.role === "patient") {
      if (!formData.age) {
        errors.age = "Age is required for patients!";
      } else {
        const age = parseInt(formData.age);
        if (age < 1 || age > 120) {
          errors.age = "Please enter a valid age (1-120)!";
        }
      }
      
      if (!formData.bloodgroup) {
        errors.bloodgroup = "Blood group is required for patients!";
      }
    }

    // Doctor specific validations
    if (formData.role === "doctor") {
      if (!formData.specialization) errors.specialization = "Specialization is required!";
      if (!formData.experience) errors.experience = "Experience is required!";
      if (!formData.consultationFee) errors.consultationFee = "Consultation fee is required!";
      
      if (formData.consultationFee) {
        const fee = parseInt(formData.consultationFee);
        if (fee < 0) {
          errors.consultationFee = "Consultation fee cannot be negative!";
        }
      }

      // Consulting days validation
      if (formData.consultingDays.length === 0) {
        errors.consultingDays = "Please select at least one consulting day!";
      }

      // Consulting timings validation
      if (!formData.consultingTimings.startTime) {
        errors.startTime = "Please select start time!";
      }
      if (!formData.consultingTimings.endTime) {
        errors.endTime = "Please select end time!";
      }
    }

    // Zip code validation
    if (formData.zipCode && formData.zipCode.length !== 6) {
      errors.zipCode = "Zip code must be exactly 6 digits!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear general error when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }

    // Clear field-specific error
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Phone number constraint - only numbers and max 10 digits
    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      validateField(name, numbersOnly);
      return;
    }

    // Age constraint - only numbers and reasonable range
    if (name === "age") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 3);
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      validateField(name, numbersOnly);
      return;
    }

    // Consultation fee constraint - only numbers
    if (name === "consultationFee") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      validateField(name, numbersOnly);
      return;
    }

    // Zip code constraint - only numbers and max 6 digits
    if (name === "zipCode") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      validateField(name, numbersOnly);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDayChange = (day) => {
    setFormData(prev => {
      const updatedDays = prev.consultingDays.includes(day)
        ? prev.consultingDays.filter(d => d !== day)
        : [...prev.consultingDays, day];
      return { ...prev, consultingDays: updatedDays };
    });
    
    // Clear consulting days error when user selects a day
    if (fieldErrors.consultingDays) {
      setFieldErrors(prev => ({ ...prev, consultingDays: "" }));
    }
  };

  const handleTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      consultingTimings: {
        ...prev.consultingTimings,
        [field]: value
      }
    }));
    
    // Clear time field error when user selects a time
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
  `${process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com"}/api/signup`,
  formData
);

      
      // Show success message
      setShowSuccess(true);
      
      // Navigate to landing page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      // Show error message in form instead of alert
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderError = (fieldName) => {
    return fieldErrors[fieldName] ? (
      <div className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
        <span className="material-symbols-outlined text-xs">error</span>
        {fieldErrors[fieldName]}
      </div>
    ) : null;
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        {/* Main Registration Form */}
        <main className="flex flex-1 justify-center py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl space-y-8">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-black">
                Create Your Account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Join our secure medical records system
              </p>
            </div>

            {/* General Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <div>
                    <p className="font-medium">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <div>
                    <p className="font-medium">Your account created successfully!</p>
                    <p className="text-sm text-green-600">Redirecting to home page...</p>
                  </div>
                </div>
              </div>
            )}

            <form
              className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-200"
              onSubmit={handleSubmit}
            >
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role *
                  </label>
                  <select
                    id="role-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                  {renderError("role")}
                </div>

                <div className="grid grid-cols-1 gap-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      minLength="2"
                      maxLength="50"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderError("fullName")}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderError("email")}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderError("password")}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderError("confirmPassword")}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      minLength="10"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderError("phone")}
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {renderError("gender")}
                  </div>

                  {/* Conditional Dropdowns */}
                  {formData.role === "doctor" && (
                    <>
                      {/* Specialization */}
                      <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization *
                        </label>
                        <select
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Specialization</option>
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Dermatologist">Dermatologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Pediatrician">Pediatrician</option>
                          <option value="Orthopedic">Orthopedic</option>
                        </select>
                        {renderError("specialization")}
                      </div>

                      {/* Experience */}
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                          Experience *
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Experience (Years)</option>
                          <option value="1">1</option>
                          <option value="2-5">2–5</option>
                          <option value="6-10">6–10</option>
                          <option value="10+">10+</option>
                        </select>
                        {renderError("experience")}
                      </div>

                      {/* Consultation Fee */}
                      <div>
                        <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-2">
                          Consultation Fee (₹) *
                        </label>
                        <input
                          id="consultationFee"
                          type="text"
                          name="consultationFee"
                          placeholder="500"
                          value={formData.consultationFee}
                          onChange={handleChange}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {renderError("consultationFee")}
                      </div>

                      {/* Consulting Days */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consulting Days *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {daysOfWeek.map(day => (
                            <div key={day} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`day-${day}`}
                                checked={formData.consultingDays.includes(day)}
                                onChange={() => handleDayChange(day)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                              />
                              <label htmlFor={`day-${day}`} className="ml-2 text-sm text-gray-700">
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                        {renderError("consultingDays")}
                      </div>

                      {/* Consulting Timings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Time *
                          </label>
                          <select
                            id="startTime"
                            value={formData.consultingTimings.startTime}
                            onChange={(e) => handleTimeChange("startTime", e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select Start Time</option>
                            {timeSlots.map(time => (
                              <option key={`start-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {renderError("startTime")}
                        </div>
                        <div>
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                            End Time *
                          </label>
                          <select
                            id="endTime"
                            value={formData.consultingTimings.endTime}
                            onChange={(e) => handleTimeChange("endTime", e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select End Time</option>
                            {timeSlots.map(time => (
                              <option key={`end-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {renderError("endTime")}
                        </div>
                      </div>
                    </>
                  )}

                  {formData.role === "patient" && (
                    <>
                      {/* Age */}
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                          Age *
                        </label>
                        <input
                          id="age"
                          type="text"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Enter Age"
                          className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {renderError("age")}
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label htmlFor="bloodgroup" className="block text-sm font-medium text-gray-700 mb-2">
                          Blood Group *
                        </label>
                        <select
                          id="bloodgroup"
                          name="bloodgroup"
                          value={formData.bloodgroup}
                          onChange={handleChange}
                          className="block w-full px-3 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                        {renderError("bloodgroup")}
                      </div>
                    </>
                  )}

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      placeholder="Full Address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      minLength="5"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {renderError("address")}
                  </div>

                  {/* City, State, Zip Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {renderError("city")}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {renderError("state")}
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code *
                      </label>
                      <input
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        placeholder="Zip Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        minLength="6"
                        maxLength="6"
                        className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {renderError("zipCode")}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || showSuccess}
                  className={`group relative w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    loading || showSuccess
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : showSuccess ? (
                    <>
                      <span className="material-symbols-outlined mr-2">check</span>
                      Account Created!
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500">
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignupPage;
