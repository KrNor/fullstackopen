/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";
import patientServices from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenPatients = patientServices.getPatientNoSsn();
  res.json(gottenPatients);
});

router.post("/", (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedPatient = patientServices.addPatient(
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation
  );

  res.json(addedPatient);
});

export default router;
