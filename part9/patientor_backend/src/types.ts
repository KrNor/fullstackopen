export interface Diagnosies {
  code: string;
  name: string;
  latin?: string;
}

export type DiagnosesNoLatin = Omit<Diagnosies, "latin">;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string;
  gender: string;
  occupation: string;
}

export type PatientNoSsn = Omit<Patient, "ssn">;
export type NewPatientEntry = Omit<Patient, "id">[];
