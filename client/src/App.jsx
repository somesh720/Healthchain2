import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";




// ==================== AUTHENTICATION COMPONENTS ====================
import LandingPage from "./components/LandingPage/LandingPage";
import PatientLogin from "./components/LoginPage/PatientLogin";
import DoctorLogin from "./components/LoginPage/DoctorLogin";
import AdminLogin from "./components/LoginPage/AdmiLogin";
import SignupPage from "./components/SignupPage/SignupPage";
import ForgotPassword from "./components/LoginPage/ForgotPassword";
import ResetPassword from "./components/LoginPage/ResetPassword";

// ==================== PATIENT DASHBOARD COMPONENTS ====================
import PatientPersonalInfo from "./components/PatientDashboard/PatientPersonalInfo";
import Report from "./components/PatientDashboard/Report";
import Doctor from "./components/PatientDashboard/Doctor";
import Requests from "./components/PatientDashboard/Requests";
import BookAppointmentForm from "./components/PatientDashboard/BookAppoinmentForm";
import BookingSuccess from "./components/PatientDashboard/BookingSuccess";
import PatientPrescription from "./components/PatientDashboard/PatientPrescription";

// ==================== DOCTOR DASHBOARD COMPONENTS ====================
import DoctorPersonalInfo from "./components/DoctorDashboard/DoctorPersonalInfo";
import PatientList from "./components/DoctorDashboard/PatientList";
import PatientIssueDetails from "./components/DoctorDashboard/PatientIssueDetails";
import PrescriptionByDoctor from "./components/DoctorDashboard/PrescriptionByDoctor";
import AppointmentApproval from "./components/DoctorDashboard/AppoinmentApproval";

// ==================== ADMIN DASHBOARD COMPONENTS ====================
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import AdminDoctors from "./components/AdminDashboard/AdminDoctors";
import AdminPatients from "./components/AdminDashboard/AdminPatients";
import AdminAppointments from "./components/AdminDashboard/AdminAppointments";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/logout" element={<LandingPage />} />

        
        {/* Authentication Routes */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ==================== PATIENT ROUTES ==================== */}
        <Route path="/patient-dashboard" element={<PatientPersonalInfo />} />
        <Route path="/patient-personal-info" element={<PatientPersonalInfo />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/patient-prescription" element={<PatientPrescription />} />
        
        {/* Patient Appointment Routes */}
        <Route path="/book-appointment" element={<BookAppointmentForm />} />
        <Route path="/success-booking" element={<BookingSuccess />} />

        {/* ==================== DOCTOR ROUTES ==================== */}
        <Route path="/doctor-dashboard" element={<DoctorPersonalInfo />} />
        <Route path="/doctor-personal-info" element={<DoctorPersonalInfo />} />
        <Route path="/patient-list" element={<PatientList />} />
        <Route path="/patient-issue-details" element={<PatientIssueDetails />} />
        <Route path="/prescription-by-doctor" element={<PrescriptionByDoctor />} />
        <Route path="/appointment-approvals" element={<AppointmentApproval />} />

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-doctors" element={<AdminDoctors />} />
        <Route path="/admin-patients" element={<AdminPatients />} />
        <Route path="/admin-appointments" element={<AdminAppointments />} />

        {/* ==================== 404 PAGE (Optional) ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
     
      </Routes>
    </Router>
  );
}
