export interface AppointmentLight {
  id: string; // e.g. "A-2026-183920"
  title: string; // Brief appointment description
  startTime: Date; // Start date and time
  endTime: Date; // End date and time
  status: "Scheduled" | "Completed" | "Cancelled" | "No-show";
}

export interface Appointment extends AppointmentLight {
  description?: string; // Additional details
  patientId: string; // Reference to Patient.id (required)
  caseId?: string; // Reference to Case.id (optional)
  recurrenceRule?: string; // iCal RRULE format for future recurring appointments
  createdAt: Date;
  updatedAt?: Date;
}

export interface AppointmentWithPatient extends Appointment {
  patient_name: string;
  patient_avatar?: string;
}

export interface AppointmentWithDetails extends AppointmentWithPatient {
  case_title?: string; // Title of linked case if exists
}

// API response type with nested Patient and Case
export interface AppointmentWithRelations extends Appointment {
  Patient?: {
    id: string;
    name: string;
    avatar?: string;
  };
  Case?: {
    id: string;
    title: string;
  };
}