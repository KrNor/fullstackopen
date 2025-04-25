// import patients from "../../data/patients";
import patients from "../../data/patientsNew";
import { PatientNoSsn, NewPatientEntry, Patient, Entry } from "../types";
import { v1 as uuid } from "uuid";

// import { toSanitizePatientEntry } from "../utils";

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

const addEntry = (patientId: string, object: Entry): Patient => {
  const patientt = getPatientWithId(patientId);

  if (patientt) {
    patientt.entries.push(object);
    return patientt;
  } else {
    throw new Error("patient not found");
  }
};

export default {
  getPatientNoSsn,
  addPatient,
  getPatientWithId,
  addEntry,
};
