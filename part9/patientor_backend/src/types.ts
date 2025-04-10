import { z } from "zod";
import { NewPatientSchema } from "./utils";
export interface Diagnosies {
  code: string;
  name: string;
  latin?: string;
}
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type DiagnosesNoLatin = Omit<Diagnosies, "latin">;

export type NewPatientEntry = Omit<Patient, "id">;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string;
  gender: Gender;
  occupation: string;
}

export type PatientNoSsn = Omit<Patient, "ssn">;

export type NewZodPatient = z.infer<typeof NewPatientSchema>;

export interface NewZodPatientWithId extends NewZodPatient {
  id: string;
}
