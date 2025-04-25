import express, { Request, Response } from "express";
import patientServices from "../services/patientService";
import {
  newPatientParser,
  errorMiddleware,
  newPatientEntryParser,
} from "../middleware/patientMiddleware";
import { Entry, NewZodPatient, NewZodPatientWithId, Patient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  const gottenPatients = patientServices.getPatientNoSsn();
  res.json(gottenPatients);
});

router.get("/:id", (req, res) => {
  try {
    const gottenPatientWithId = patientServices.getPatientWithId(req.params.id);
    res.json(gottenPatientWithId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "unknown error" });
    }
  }
});

// router.post("/:id/entries", newPatientEntryParser, (req, res) => {

router.post(
  "/:id/entries",
  newPatientEntryParser,
  (req: Request<object, unknown, Entry>, res: Response<Patient>) => {
    if ("id" in req.params && typeof req.params.id === "string") {
      const patientWithNewEntry = patientServices.addEntry(
        req.params.id,
        req.body
      );
      res.json(patientWithNewEntry);
    }
  }
);

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
