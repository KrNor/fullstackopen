import { FormEvent, useState } from "react";
import patientService from "../../services/patients";

import {
  Patient,
  Diagnosis,
  HealthCheckEntryValues,
  OccupationalHealthcareEntryValues,
  HospitalEntryValues,
  HealthCheckRating,
  Discharge,
  SickLeave,
} from "../../types";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import axios from "axios";

interface NewVisitEntryProps {
  setShowEntryCreation: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: string | unknown;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface DisplayEntryFormProps extends NewVisitEntryProps {
  newEntryType: string;
}

const DisplayEntryForm = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
  newEntryType,
}: DisplayEntryFormProps) => {
  switch (newEntryType) {
    case "HealthCheckEntry":
      return (
        <NewHealthCheckEntry
          setShowEntryCreation={setShowEntryCreation}
          setPatient={setPatient}
          patientId={patientId}
          setError={setError}
        />
      );
    case "OccupationalHealthcareEntry":
      return (
        <NewOccupationalHealthcareEntry
          setShowEntryCreation={setShowEntryCreation}
          setPatient={setPatient}
          patientId={patientId}
          setError={setError}
        />
      );
    case "HospitalEntry":
      return (
        <NewHospitalEntry
          setShowEntryCreation={setShowEntryCreation}
          setPatient={setPatient}
          patientId={patientId}
          setError={setError}
        />
      );

    default:
      return <div></div>;
  }
};

const NewEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
}: NewVisitEntryProps) => {
  const [newEntryType, setNewEntryType] = useState("");

  const handleTypeChange = (event: SelectChangeEvent) => {
    setNewEntryType(event.target.value);
  };
  return (
    <Box sx={{ p: 2, border: "1px dashed grey" }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel id="select-new-entry-type" sx={{ m: 1, minWidth: 120 }}>
          type of entry
        </InputLabel>
        <Select
          labelId="select-new-entry-type"
          id="select-type-standard"
          value={newEntryType}
          onChange={handleTypeChange}
          label="Type"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"HospitalEntry"}>HospitalEntry</MenuItem>
          <MenuItem value={"OccupationalHealthcareEntry"}>
            OccupationalHealthcareEntry
          </MenuItem>
          <MenuItem value={"HealthCheckEntry"}>HealthCheckEntry</MenuItem>
        </Select>
      </FormControl>
      <DisplayEntryForm
        setShowEntryCreation={setShowEntryCreation}
        setPatient={setPatient}
        patientId={patientId}
        setError={setError}
        newEntryType={newEntryType}
      />
    </Box>
  );
};

interface BaseEntryOnlyStrings {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: string;
}

interface InitialHealthCheckEntryValues extends BaseEntryOnlyStrings {
  type: "HealthCheck";
  healthCheckRating: string;
}

interface InitialOccupationalHealthcareEntryValues
  extends BaseEntryOnlyStrings {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeaveStart: string;
  sickLeaveEnd: string;
}

interface InitialHospitalEntryValues extends BaseEntryOnlyStrings {
  type: "Hospital";
  dischargeDate: string;
  dischargeCriteria: string;
}

interface BaseEntryProps<T extends BaseEntryOnlyStrings> {
  initialData: T;
  onSubmit: (event: FormEvent, data: T) => Promise<void>;
  setShowEntryCreation: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

const NewBaseEntry = <T extends BaseEntryOnlyStrings>({
  initialData,
  onSubmit,
  setShowEntryCreation,
  children,
}: BaseEntryProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const CreateNewPatientEntry = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e, formData);
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
          value={formData.description}
          onChange={handleChange}
        />
        <br />
        <TextField
          name="date"
          id="date-textfield"
          label="Date"
          value={formData.date}
          onChange={handleChange}
        />
        <br />
        <TextField
          name="specialist"
          id="specialist-textfield"
          label="Specialist"
          value={formData.specialist}
          onChange={handleChange}
        />
        <br />
        <TextField
          name="diagnosisCodes"
          id="diagnosisCodes-textfield"
          label="Diagnosis Codes"
          value={formData.diagnosisCodes}
          onChange={handleChange}
        />
        <br />

        {children}

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
        </Box>
        <Button variant="outlined" onClick={() => setShowEntryCreation(false)}>
          Hide Creation
        </Button>
      </FormControl>
    </Box>
  );
};

const NewHealthCheckEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
}: NewVisitEntryProps) => {
  const [healthCheckRating, setHealthCheckRating] = useState("");

  const initialData: InitialHealthCheckEntryValues = {
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: "",
    healthCheckRating: healthCheckRating,
  };

  const SubmitHealthCheckEntry = async (
    event: FormEvent,
    data: BaseEntryOnlyStrings
  ) => {
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
        data.diagnosisCodes.length > 0 ? data.diagnosisCodes.split(",") : [];
      const updatedPatient: Patient = await patientService.createEntry(
        {
          type: initialData.type,
          description: data.description,
          date: data.date,
          specialist: data.specialist,
          diagnosisCodes: diagnosiesInArray as Array<Diagnosis["code"]>,
          healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
        } as HealthCheckEntryValues,
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
    <NewBaseEntry<InitialHealthCheckEntryValues>
      initialData={initialData}
      onSubmit={SubmitHealthCheckEntry}
      setShowEntryCreation={setShowEntryCreation}
    >
      <br />
      <TextField
        name="healthCheckRating"
        id="healthCheckRating-textfield"
        label="Health Check Rating"
        value={initialData.healthCheckRating}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setHealthCheckRating(event.target.value);
        }}
      />
      <br />
    </NewBaseEntry>
  );
};

const NewOccupationalHealthcareEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
}: NewVisitEntryProps) => {
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const initialData: InitialOccupationalHealthcareEntryValues = {
    type: "OccupationalHealthcare",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: "",
    employerName: employerName,
    sickLeaveStart: sickLeaveStart,
    sickLeaveEnd: sickLeaveEnd,
  };

  const SubmitOccupationalHealthcareEntry = async (
    event: FormEvent,
    data: BaseEntryOnlyStrings
  ) => {
    event.preventDefault();
    try {
      if (employerName.length < 1) {
        setError("Write in the employer name");
        throw Error("Write in the employer name");
      }

      if (!(typeof patientId === "string")) {
        setError("the id is not a string");
        throw Error("the id is not a string");
      }

      const diagnosiesInArray: Array<Diagnosis["code"]> =
        data.diagnosisCodes.length > 0 ? data.diagnosisCodes.split(",") : [];

      const sickLeave: SickLeave = {
        startDate: sickLeaveStart,
        endDate: sickLeaveEnd,
      };

      const updatedPatient: Patient = await patientService.createEntry(
        {
          type: initialData.type,
          description: data.description,
          date: data.date,
          specialist: data.specialist,
          diagnosisCodes: diagnosiesInArray as Array<Diagnosis["code"]>,
          employerName: employerName,
          sickLeave: sickLeave as SickLeave,
        } as OccupationalHealthcareEntryValues,
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
    <NewBaseEntry<InitialOccupationalHealthcareEntryValues>
      initialData={initialData}
      onSubmit={SubmitOccupationalHealthcareEntry}
      setShowEntryCreation={setShowEntryCreation}
    >
      <br />
      <TextField
        name="employerName"
        id="employerName-textfield"
        label="Employer Name"
        value={initialData.employerName}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmployerName(event.target.value);
        }}
      />
      <TextField
        name="SickLeaveStart"
        id="SickLeaveStart-textfield"
        label="Sick Leave Start"
        value={initialData.sickLeaveStart}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSickLeaveStart(event.target.value);
        }}
      />
      <TextField
        name="SickLeaveEnd"
        id="SickLeaveEnd-textfield"
        label="Sick Leave End"
        value={initialData.sickLeaveEnd}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSickLeaveEnd(event.target.value);
        }}
      />
      <br />
    </NewBaseEntry>
  );
};

const NewHospitalEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
}: NewVisitEntryProps) => {
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const initialData: InitialHospitalEntryValues = {
    type: "Hospital",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: "",
    dischargeDate: dischargeDate,
    dischargeCriteria: dischargeCriteria,
  };

  const SubmitHospitalEntry = async (
    event: FormEvent,
    data: BaseEntryOnlyStrings
  ) => {
    event.preventDefault();
    try {
      if (!(typeof patientId === "string")) {
        setError("the id is not a string");
        throw Error("the id is not a string");
      }
      const diagnosiesInArray: Array<Diagnosis["code"]> =
        data.diagnosisCodes.length > 0 ? data.diagnosisCodes.split(",") : [];
      const discharge: Discharge = {
        date: dischargeDate,
        criteria: dischargeCriteria,
      };

      const updatedPatient: Patient = await patientService.createEntry(
        {
          type: initialData.type,
          description: data.description,
          date: data.date,
          specialist: data.specialist,
          diagnosisCodes: diagnosiesInArray as Array<Diagnosis["code"]>,
          discharge: discharge as Discharge,
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
    <NewBaseEntry<InitialHospitalEntryValues>
      initialData={initialData}
      onSubmit={SubmitHospitalEntry}
      setShowEntryCreation={setShowEntryCreation}
    >
      <br />
      <TextField
        name="dischargeDate"
        id="dischargeDate-textfield"
        label="Discharge date"
        value={initialData.dischargeDate}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDischargeDate(event.target.value);
        }}
      />
      <TextField
        name="dischargeCriteria"
        id="dischargeCriteria-textfield"
        label="Discharge criteria"
        value={initialData.dischargeCriteria}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDischargeCriteria(event.target.value);
        }}
      />
      <br />
    </NewBaseEntry>
  );
};

export default NewEntry;
