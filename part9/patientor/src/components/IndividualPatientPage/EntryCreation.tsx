import { FormEvent, useEffect, useState } from "react";
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
  BaseEntryNoId,
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
  Input,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import axios from "axios";

interface NewVisitEntryProps {
  setShowEntryCreation: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: string | unknown;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  diagnosies: Diagnosis[];
}

interface DisplayEntryFormProps extends NewVisitEntryProps {
  newEntryType: string;
}

const DisplayEntryForm = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
  diagnosies,
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
          diagnosies={diagnosies}
        />
      );
    case "OccupationalHealthcareEntry":
      return (
        <NewOccupationalHealthcareEntry
          setShowEntryCreation={setShowEntryCreation}
          setPatient={setPatient}
          patientId={patientId}
          setError={setError}
          diagnosies={diagnosies}
        />
      );
    case "HospitalEntry":
      return (
        <NewHospitalEntry
          setShowEntryCreation={setShowEntryCreation}
          setPatient={setPatient}
          patientId={patientId}
          setError={setError}
          diagnosies={diagnosies}
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
  diagnosies,
}: NewVisitEntryProps) => {
  const [newEntryType, setNewEntryType] = useState("");

  const handleTypeChange = (event: SelectChangeEvent) => {
    setNewEntryType(event.target.value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
        border: "1px dashed grey",
      }}
    >
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
        diagnosies={diagnosies}
      />
    </Box>
  );
};

// this is saved for testing before importing BaseEntryNoId from types
// interface BaseEntryOnlyStrings {
//   description: string;
//   date: string;
//   specialist: string;
//   diagnosisCodes: Array<Diagnosis["code"]>;
// }

interface InitialHealthCheckEntryValues extends BaseEntryNoId {
  type: "HealthCheck";
  healthCheckRating: string;
}

interface InitialOccupationalHealthcareEntryValues extends BaseEntryNoId {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeaveStart: string;
  sickLeaveEnd: string;
}

interface InitialHospitalEntryValues extends BaseEntryNoId {
  type: "Hospital";
  dischargeDate: string;
  dischargeCriteria: string;
}

interface BaseEntryProps<T extends BaseEntryNoId> {
  initialData: T;
  onSubmit: (event: FormEvent, data: T) => Promise<void>;
  setShowEntryCreation: React.Dispatch<React.SetStateAction<boolean>>;
  diagnosies: Diagnosis[];
  children?: React.ReactNode;
}

const NewBaseEntry = <T extends BaseEntryNoId>({
  initialData,
  onSubmit,
  setShowEntryCreation,
  diagnosies,
  children,
}: BaseEntryProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [currentDiagnosisCodes, setCurrentDiagnosisCodes] = useState<string[]>(
    []
  );
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const diagnosyCodesToSave = diagnosies.map((diagnosy) => {
      return diagnosy.code;
    });
    setDiagnosisCodes(diagnosyCodesToSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeCheckbox = (
    event: SelectChangeEvent<typeof currentDiagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setCurrentDiagnosisCodes(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const CreateNewPatientEntry = (e: FormEvent) => {
    e.preventDefault();
    const formData2 = {
      ...formData,
      diagnosisCodes: currentDiagnosisCodes,
      date: visitDate,
    };
    onSubmit(e, formData2);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        outlineStyle: "dotted",
      }}
      component="form"
      onSubmit={CreateNewPatientEntry}
    >
      <Typography variant="h5">New entry:</Typography>
      <TextField
        name="description"
        id="description-textfield"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="date-textfield">Date</InputLabel>
        <Input
          type="date"
          name="date"
          id="date-textfield"
          value={visitDate}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setVisitDate(event.target.value);
          }}
        />
      </FormControl>

      <TextField
        name="specialist"
        id="specialist-textfield"
        label="Specialist"
        value={formData.specialist}
        onChange={handleChange}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="diagnosis-codes-label">diagnosy codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          id="diagnosis-codes-textfield"
          value={currentDiagnosisCodes}
          onChange={handleChangeCheckbox}
          multiple
          MenuProps={MenuProps}
          renderValue={(selected) => selected.join(", ")}
        >
          {diagnosisCodes.map((diagnosy) => (
            <MenuItem key={diagnosy} value={diagnosy}>
              {diagnosy}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {children}
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
    </Box>
  );
};

const NewHealthCheckEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
  diagnosies,
}: NewVisitEntryProps) => {
  const [healthCheckRating, setHealthCheckRating] = useState("0");

  const initialData: InitialHealthCheckEntryValues = {
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    healthCheckRating: healthCheckRating,
  };

  const SubmitHealthCheckEntry = async (
    event: FormEvent,
    data: BaseEntryNoId
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
      const updatedPatient: Patient = await patientService.createEntry(
        {
          type: initialData.type,
          description: data.description,
          date: data.date,
          specialist: data.specialist,
          diagnosisCodes: data.diagnosisCodes,
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
      diagnosies={diagnosies}
    >
      <FormControl>
        <InputLabel id="healthCheckRating-textfield">
          Select a health rating
        </InputLabel>
        <Select
          id="healthCheckRating-textfield"
          value={healthCheckRating}
          label="Health Check Rating"
          onChange={(event: SelectChangeEvent<string>) => {
            setHealthCheckRating(event.target.value);
          }}
        >
          {Object.values(HealthCheckRating)
            .filter((value) => typeof value === "number")
            .map((value) => (
              <MenuItem key={value} value={value}>
                {HealthCheckRating[value]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </NewBaseEntry>
  );
};

const NewOccupationalHealthcareEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
  diagnosies,
}: NewVisitEntryProps) => {
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [sickLeaveEnd, setSickLeaveEnd] = useState(
    new Date().toISOString().split("T")[0]
  );

  const initialData: InitialOccupationalHealthcareEntryValues = {
    type: "OccupationalHealthcare",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    employerName: employerName,
    sickLeaveStart: sickLeaveStart,
    sickLeaveEnd: sickLeaveEnd,
  };

  const SubmitOccupationalHealthcareEntry = async (
    event: FormEvent,
    data: BaseEntryNoId
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
          diagnosisCodes: data.diagnosisCodes,
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
      diagnosies={diagnosies}
    >
      <TextField
        name="employerName"
        id="employerName-textfield"
        label="Employer Name"
        value={initialData.employerName}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmployerName(event.target.value);
        }}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="SickLeaveStart-textfield">Sick Leave Start</InputLabel>
        <Input
          type="date"
          name="SickLeaveStart"
          id="SickLeaveStart-textfield"
          value={initialData.sickLeaveStart}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSickLeaveStart(event.target.value);
          }}
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="SickLeaveEnd-textfield">Sick Leave End</InputLabel>
        <Input
          type="date"
          name="SickLeaveEnd"
          id="SickLeaveEnd-textfield"
          value={initialData.sickLeaveEnd}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSickLeaveEnd(event.target.value);
          }}
        />
      </FormControl>
    </NewBaseEntry>
  );
};

const NewHospitalEntry = ({
  setShowEntryCreation,
  patientId,
  setPatient,
  setError,
  diagnosies,
}: NewVisitEntryProps) => {
  const [dischargeDate, setDischargeDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const initialData: InitialHospitalEntryValues = {
    type: "Hospital",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    dischargeDate: dischargeDate,
    dischargeCriteria: dischargeCriteria,
  };

  const SubmitHospitalEntry = async (event: FormEvent, data: BaseEntryNoId) => {
    event.preventDefault();
    try {
      if (!(typeof patientId === "string")) {
        setError("the id is not a string");
        throw Error("the id is not a string");
      }
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
          diagnosisCodes: data.diagnosisCodes,
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
      diagnosies={diagnosies}
    >
      <FormControl fullWidth>
        <InputLabel id="dischargeDate-datefield">Discharge date</InputLabel>
        <Input
          type="date"
          name="dischargeDate"
          id="dischargeDate-datefield"
          value={initialData.dischargeDate}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDischargeDate(event.target.value);
          }}
        />
      </FormControl>

      <TextField
        name="dischargeCriteria"
        id="dischargeCriteria-textfield"
        label="Discharge criteria"
        value={initialData.dischargeCriteria}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDischargeCriteria(event.target.value);
        }}
        fullWidth
      />
    </NewBaseEntry>
  );
};

export default NewEntry;
