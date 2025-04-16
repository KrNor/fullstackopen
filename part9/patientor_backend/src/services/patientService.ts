import patients from "../../data/patients";
import { PatientNoSsn, NewPatientEntry, Patient } from "../types";
import { v1 as uuid } from "uuid";

const getPatientNoSsn = (): PatientNoSsn[] => {
  const patientsToReturn = patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
  return patientsToReturn;
};

const getPatientWithId = (idOfPatient: string): Patient => {
  const patientWithId = patients.find((patient: Patient) => {
    return patient.id === idOfPatient;
  });
  if (patientWithId) {
    return patientWithId;
  } else {
    throw new Error("Patient not found");
  }
};

const addPatient = (object: NewPatientEntry): Patient => {
  const newPatient = {
    ...object,
    id: uuid(),
    entries: [],
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatientNoSsn,
  addPatient,
  getPatientWithId,
};
