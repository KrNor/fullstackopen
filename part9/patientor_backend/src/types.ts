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

export type NewPatientEntry = Omit<Patient, "id" | "entries">;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type PatientNoSsn = Omit<Patient, "ssn" | "entries">;

export type NewZodPatient = z.infer<typeof NewPatientSchema>;

export interface NewZodPatientWithId extends NewZodPatient {
  id: string;
}
