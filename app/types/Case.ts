export interface CaseLight {
  id: string; // e.g. "C-2024-183920"
  case_name: string; // Brief case description
  intervention_date: Date; // ISO 8601 date format
}

export interface Case extends CaseLight {
  patient_id: string; // Reference to Patient.id
  case_report?: string;
  doctor_note?: string;
}

export interface CaseWithPatient extends Case {
  patient_name: string,
  patient_avatar: string
}

export interface CaseReport {
  id: string,
  report_link: string
}