import express from "express";
import patientServices from "../services/patientService";
import { toSanitisePatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenPatients = patientServices.getPatientNoSsn();
  res.json(gottenPatients);
});

router.post("/", (req, res) => {
  try {
    const newPatientToSave = toSanitisePatient(req.body);

    const addedPatient = patientServices.addPatient(newPatientToSave);

    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
