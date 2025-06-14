export interface PatientLight {
  id: string; // e.g. "P-2024-183920"
  name: string; // Full name of the patient
}

export interface Patient extends PatientLight {
  last_intervention: null;
  avatar: string; // URL to avatar image
  gender: "Male" | "Female";
  date_of_birth: string; // Format: YYYY-MM-DD
  phone_number: string; // Lebanese number format
  email: string; // e.g. "name@example.com"
}

export interface PatientWithLastCase extends Omit<Patient, 'last_intervention'> {
  last_intervention: Date | null;
}
