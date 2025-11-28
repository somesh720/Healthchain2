// Profile image utility for consistent images across the application
export const getProfileImage = (gender = 'other', role = 'patient') => {
  const baseImages = {
    patient: {
      male: '/images/patient-male.png',
      female: '/images/patient-female.png',
      other: '/images/patient-other.png'
    },
    doctor: {
      male: '/images/doctor-male.png',
      female: '/images/doctor-female.png',
      other: '/images/doctor-other.png'
    },
    admin: {
      male: '/images/admin-male.png',
      female: '/images/admin-female.png',
      other: '/images/admin-other.png'
    }
  };

  const roleImages = baseImages[role?.toLowerCase()] || baseImages.patient;
  
  switch (gender?.toLowerCase()) {
    case 'male':
      return roleImages.male;
    case 'female':
      return roleImages.female;
    default:
      return roleImages.other;
  }
};

export const getPatientImage = (gender) => getProfileImage(gender, 'patient');
export const getDoctorImage = (gender) => getProfileImage(gender, 'doctor');
export const getAdminImage = (gender) => getProfileImage(gender, 'admin');