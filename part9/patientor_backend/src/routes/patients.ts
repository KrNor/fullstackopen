import express, { Request, Response } from "express";
import patientServices from "../services/patientService";
import {
  newPatientParser,
  errorMiddleware,
} from "../middleware/patientMiddleware";
import { NewZodPatient, NewZodPatientWithId } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenPatients = patientServices.getPatientNoSsn();
  res.json(gottenPatients);
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewZodPatient>,
    res: Response<NewZodPatientWithId>
  ) => {
    const addedPatient = patientServices.addPatient(req.body);

    res.json(addedPatient);
  }
);

router.use(errorMiddleware);

export default router;
