import diagnosies from "../../data/diagnoses";
import { Diagnosis, DiagnosesNoLatin } from "../types";

const getDiagnoses = (): Diagnosis[] => {
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
