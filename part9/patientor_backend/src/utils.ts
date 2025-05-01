import {
  Gender,
  NewPatientEntry,
  BaseEntry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Entry,
} from "./types";
import { z } from "zod";
import { v1 as uuid } from "uuid";

export const NewPatientSchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.string().date(),
  ssn: z.string().optional(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(3),
});

export const toSanitizePatient = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};

export const toSanitizePatientEntry = (object: unknown): Entry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  const entry = object as { type?: string };

  if (!entry.type) {
    throw new Error("Entry type is missing");
  } else {
    switch (entry.type) {
      case "HealthCheck":
        return sanitizeHealthCheckEntry(entry);
      case "Hospital":
        return sanitizeHospitalEntry(entry);
      case "OccupationalHealthcare":
        return sanitizeOccupationalHealthcareEntry(entry);

      default:
        throw new Error(`entry type: "${entry.type}" is not known`);
    }
  }
};

const sanitizeBaseEntry = (object: unknown): BaseEntry => {
  if (
    typeof object !== "object" ||
    object === null ||
    !("description" in object) ||
    !("date" in object) ||
    !("specialist" in object)
  ) {
    throw new Error("Missing data");
  }

  if (!object.description) throw new Error("Missing description");
  if (!object.date) throw new Error("Missing date");
  if (!object.specialist) throw new Error("Missing specialist");

  const idToBeUsed = uuid();

  const baseEntry: BaseEntry = {
    id: z.string().parse(idToBeUsed),
    description: z.string().parse(object.description),
    date: z.string().date().parse(object.date),
    specialist: z.string().parse(object.specialist),
    diagnosisCodes: [],
  };

  // I decided it's worth saving the diagnosy codes, even if they are not in the data currently in case it is outdated.
  if ("diagnosisCodes" in object) {
    if (Array.isArray(object.diagnosisCodes)) {
      const uniqueDiagnosies = [...new Set(object.diagnosisCodes)].filter(
        (diagnosis: string) => diagnosis.length > 0
      );

      baseEntry.diagnosisCodes = uniqueDiagnosies;
    } else {
      throw new Error("Valid diagnosis codes must be an array");
    }
  }

  return baseEntry;
};

function sanitizeHealthCheckEntry(object: unknown): HealthCheckEntry {
  if (isHealthCheckEntry(object)) {
    const sanitizedBaseEntry = sanitizeBaseEntry(object);

    if (
      !object.healthCheckRating &&
      !Number.isInteger(object.healthCheckRating)
    ) {
      throw new Error("Health Check Rating must be a number between 0 and 3");
    }

    return {
      ...sanitizedBaseEntry,
      type: "HealthCheck",
      healthCheckRating: z
        .number()
        .int()
        .nonnegative()
        .lte(3)
        .parse(object.healthCheckRating),
    };
  } else {
    throw new Error("The entry is not a HealthCheckEntry");
  }
}

function sanitizeHospitalEntry(object: unknown): HospitalEntry {
  if (isHospitalEntry(object)) {
    const sanitizedBaseEntry = sanitizeBaseEntry(object);

    if (!object.discharge) throw new Error("Missing discharge information");
    if (!object.discharge.date) throw new Error("Missing discharge date");
    if (!object.discharge.criteria)
      throw new Error("Missing discharge criteria");

    const hospitalEntry: HospitalEntry = {
      ...sanitizedBaseEntry,
      type: "Hospital",
      discharge: {
        date: z.string().date().parse(object.discharge.date),
        criteria: z.string().parse(object.discharge.criteria),
      },
    };

    return hospitalEntry;
  } else {
    throw new Error("The entry is not a HospitalEntry");
  }
}

function sanitizeOccupationalHealthcareEntry(
  object: unknown
): OccupationalHealthcareEntry {
  if (isOccupationalHealthcareEntry(object)) {
    const sanitizedBaseEntry = sanitizeBaseEntry(object);

    if (!object.employerName) throw new Error("Missing employer name");

    const entry: OccupationalHealthcareEntry = {
      ...sanitizedBaseEntry,
      type: "OccupationalHealthcare",
      employerName: z.string().parse(object.employerName),
    };

    if (object.sickLeave) {
      if (!object.sickLeave.startDate || !object.sickLeave.endDate) {
        throw new Error("Sick leave must include both start and end dates");
      }

      entry.sickLeave = {
        startDate: z.string().date().parse(object.sickLeave.startDate),
        endDate: z.string().date().parse(object.sickLeave.endDate),
      };

      if (
        Date.parse(object.sickLeave.startDate) >=
        Date.parse(object.sickLeave.endDate)
      ) {
        throw new Error("The start date must come before the end date");
      }
    }
    return entry;
  } else {
    throw new Error("The entry is not a OccupationalHealthcareEntry");
  }
}

// Type guards
const isHospitalEntry = (entry: unknown): entry is HospitalEntry => {
  const entry2 = entry as { type?: string };
  if ("type" in entry2) {
    return entry2?.type === "Hospital";
  } else {
    return false;
  }
};

const isOccupationalHealthcareEntry = (
  entry: unknown
): entry is OccupationalHealthcareEntry => {
  const entry2 = entry as { type?: string };

  if ("type" in entry2) {
    return entry2?.type === "OccupationalHealthcare";
  } else {
    return false;
  }
};

const isHealthCheckEntry = (entry: unknown): entry is HealthCheckEntry => {
  const entry2 = entry as { type?: string };

  if ("type" in entry2) {
    return entry2?.type === "HealthCheck";
  } else {
    return false;
  }
};
