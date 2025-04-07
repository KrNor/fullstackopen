import diagnosies from "../../data/diagnoses";
import { Diagnosies, DiagnosesNoLatin } from "../types";

const getDiagnoses = (): Diagnosies[] => {
  return diagnosies;
};
const getDiagnosesNoLatin = (): DiagnosesNoLatin[] => {
  return diagnosies.map(({ code, name }) => ({
    code,
    name,
  }));
};

export default {
  getDiagnoses,
  getDiagnosesNoLatin,
};
