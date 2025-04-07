import express from "express";
import diagnosyServices from "../services/diagnosyService";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenDiagnoses = diagnosyServices.getDiagnoses();
  res.json(gottenDiagnoses);
});

export default router;
