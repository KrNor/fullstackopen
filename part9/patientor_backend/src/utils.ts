import { Gender, NewPatientEntry } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.string().date(),
  ssn: z.string().optional(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(3),
});

export const toSanitisePatient = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};
