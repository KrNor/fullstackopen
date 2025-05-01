import { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnosyService from "../../services/diagnoses";
import { DisplayEntries } from "./EntryDisplay";

import {
  Patient,
  Gender,
  Diagnosis,
  HospitalEntryValues,
  HealthCheckRating,
} from "../../types";
import {
  Typography,
  Alert,
  TextField,
  Button,
  FormControl,
  Box,
} from "@mui/material";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import axios from "axios";

interface Genders {
  gender: Gender;
}

const DisplayGender = ({ gender }: Genders) => {
  switch (gender) {
    case "male":
      return <MaleIcon />;
    case "female":
      return <FemaleIcon />;
    case "other":
      return <TransgenderIcon />;
    default:
      return <QuestionMarkIcon />;
  }
};

interface NewHealthCheckEntryProps {
  setShowEntryCreation: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: string | unknown;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const NewHealthCheckEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
}: NewHealthCheckEntryProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [type, _setType] = useState("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");

  const CreateNewPatientEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      if (healthCheckRating.length < 1) {
        setError("Write in a health Check Rating");
        throw Error("Write in a health Check Rating");
      }
      if (Number(healthCheckRating) < 0 && Number(healthCheckRating) > 3) {
        setError("Write in a number between 0-3");
        throw Error("Write in a number between 0-3");
      }

      if (!(typeof patientId === "string")) {
        setError("the id is not a string");
        throw Error("the id is not a string");
      }

      const diagnosiesInArray: Array<Diagnosis["code"]> =
        diagnosisCodes.length > 0 ? diagnosisCodes.split(",") : [];

      const updatedPatient: Patient = await patientService.createEntry(
        {
          type: type,
          description: description,
          date: date,
          specialist: specialist,
          diagnosisCodes: diagnosiesInArray as Array<Diagnosis["code"]>,
          healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
        } as HospitalEntryValues,
        patientId
      );
      setShowEntryCreation(false);
      setPatient(updatedPatient);
      setError("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (axios.isAxiosError(e)) {
          if (e.response?.data.error) {
            if (typeof e.response.data.error === "object") {
              setError(`Error: ${e.response.data.error[0].message}`);
            } else {
              setError(`Error: ${e.response.data.error}`);
            }
          }
        }
      } else {
        setError("Unknown error");
      }
    }
  };
  return (
    <Box>
      <FormControl
        component="form"
        sx={{ outlineStyle: "dotted", gap: 1 }}
        fullWidth
        onSubmit={CreateNewPatientEntry}
      >
        <Typography variant="h5">New entry:</Typography>
        <TextField
          name="description"
          id="description-textfield"
          label="Description"
          value={description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDescription(event.target.value);
          }}
        />
        <br />
        <TextField
          name="date"
          id="date-textfield"
          label="Date"
          value={date}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDate(event.target.value);
          }}
        />
        <br />
        <TextField
          name="specialist"
          id="specialist-textfield"
          label="Specialist"
          value={specialist}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSpecialist(event.target.value);
          }}
        />
        <br />
        <TextField
          name="diagnosisCodes"
          id="diagnosisCodes-textfield"
          label="Diagnosis Codes"
          value={diagnosisCodes}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDiagnosisCodes(event.target.value);
          }}
        />
        <br />
        <TextField
          name="healthCheckRating"
          id="healthCheckRating-textfield"
          label="Health Check Rating"
          value={healthCheckRating}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHealthCheckRating(event.target.value);
          }}
        />
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: 2,
          }}
        >
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button variant="outlined">Cancel</Button>
        </Box>
        <Button variant="outlined" onClick={() => setShowEntryCreation(false)}>
          Hide Creation
        </Button>
      </FormControl>
    </Box>
  );
};

const IndividualPatientPage = () => {
  const [patient, setPatient] = useState<Patient>({
    id: "",
    name: "Patient not found",
    occupation: "",
    gender: "" as Gender,
    ssn: "",
    dateOfBirth: "",
    entries: [],
  });
  const [diagnosies, setDiagnosies] = useState<Diagnosis[]>();

  const [error, setError] = useState<string>();

  const [showEntryCreation, setShowEntryCreation] = useState<boolean>(false);

  const { id } = useParams();

  useEffect(() => {
    async function getPerson(): Promise<void> {
      try {
        if (typeof id === "string") {
          const wantedPatient = await patientService.getById(id);
          setPatient(wantedPatient);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (
            error.response?.data &&
            typeof error.response.data.error === "string"
          ) {
            setError(error.response.data.error);
          } else {
            setError("Unknown problem when trying to get patient data");
          }
        }
      }
    }
    async function getDiagnosies(): Promise<void> {
      try {
        const diagnosyList = await diagnosyService.getAll();
        setDiagnosies(diagnosyList);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (
            error.response?.data &&
            typeof error.response.data.error === "string"
          ) {
            setError(error.response.data.error);
          } else {
            setError("Unknown problem when trying to get diagnosy list");
          }
        }
      }
    }
    getPerson();
    getDiagnosies();
  }, [id]);

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h5">
        {patient.name} <DisplayGender gender={patient.gender} />
      </Typography>
      <Typography component="p">ssn: {patient.ssn}</Typography>
      <Typography component="p">occupation: {patient.occupation}</Typography>
      {showEntryCreation ? (
        <NewHealthCheckEntry
          setShowEntryCreation={setShowEntryCreation}
          setPatient={setPatient}
          patientId={id}
          setError={setError}
        />
      ) : (
        <Button
          variant="outlined"
          onClick={() => setShowEntryCreation(!showEntryCreation)}
        >
          Create a new patient entry
        </Button>
      )}
      <Typography variant="h5">Entries: </Typography>
      {patient.entries.length > 0 && diagnosies ? (
        <DisplayEntries diagnosies={diagnosies} entryList={patient.entries} />
      ) : (
        <Typography component="p">none</Typography>
      )}
    </div>
  );
};

export default IndividualPatientPage;
