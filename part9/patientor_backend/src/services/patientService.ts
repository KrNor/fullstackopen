import patients from "../../data/patients";
import { PatientNoSsn } from "../types";

const getPatientNoSsn = (): PatientNoSsn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getPatientNoSsn,
};
