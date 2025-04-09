import { Gender, NewPatientEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((gender) => gender.toString())
    .includes(gender);
};

const parseName = (stringToParse: unknown): string => {
  if (!stringToParse || !isString(stringToParse)) {
    throw new Error("The entered name is bad");
  }
  return stringToParse;
};
const parseDateOfBirth = (stringToParse: unknown): string => {
  if (!stringToParse || !isString(stringToParse)) {
    throw new Error("The entered date of birth is bad");
  }
  return stringToParse;
};
const parseSsn = (stringToParse: unknown): string => {
  if (!stringToParse || !isString(stringToParse)) {
    throw new Error("The entered ssn is bad");
  }
  return stringToParse;
};

const parseOccupation = (stringToParse: unknown): string => {
  if (!stringToParse || !isString(stringToParse)) {
    throw new Error("The entered occupation is bad");
  }
  return stringToParse;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("the specified gender does not exist in our records");
  } else {
    return gender;
  }
};

export const toSanitisePatient = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Bad or missing data");
  }
  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatientToSave: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
    };

    return newPatientToSave;
  }
  throw new Error("badly inputed data, at least 1 field is missing/wrong");
};
