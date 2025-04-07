import express from "express";
import patientServices from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenPatients = patientServices.getPatientNoSsn();
  res.json(gottenPatients);
});

export default router;
