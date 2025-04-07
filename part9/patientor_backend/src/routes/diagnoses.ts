import express from "express";
import diagnosyServices from "../services/diagnosyService";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenDiagnoses = diagnosyServices.getDiagnoses();
  //   const gottenDiagnoses = diagnosyServices.getDiagnosesNoLatin();

  //   console.log(gottenDiagnoses);
  res.json(gottenDiagnoses);
});

export default router;
