import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { NewPatientSchema, toSanitizePatientEntry } from "../utils";
import { validate as uuidValidate } from "uuid";

export const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const newPatientEntryParser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.params.id &&
      typeof req.params.id === "string" &&
      uuidValidate(req.params.id)
    ) {
      toSanitizePatientEntry(req.body);
      next();
    } else {
      res.status(400).send({ error: "invalid patient id" });
    }
  } catch (error: unknown) {
    next(error);
  }
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else if (error instanceof Error) {
    res.status(400).send({ error: error.message });
  } else {
    next(error);
  }
};
