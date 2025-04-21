import {
  Entry,
  Diagnosis,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  HealthCheckRating,
} from "../../types";
import { Typography, List, ListItem, Box } from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; // for HospitalEntry
import CheckIcon from "@mui/icons-material/Check"; // for HealthCheck
import AddBusinessIcon from "@mui/icons-material/AddBusiness"; // for OccupationalHealthcare

import FavoriteIcon from "@mui/icons-material/Favorite";

interface Props {
  diagnosies: Diagnosis[];
  entryList: Entry[];
}

interface SingleProps {
  diagnosies: Diagnosis[];
  entry: Entry;
}
interface HospitalEntryProps {
  diagnosies: Diagnosis[];
  entry: HospitalEntry;
}

interface OccupationalHealthcareProps {
  diagnosies: Diagnosis[];
  entry: OccupationalHealthcareEntry;
}

interface HealthCheckProps {
  diagnosies: Diagnosis[];
  entry: HealthCheckEntry;
}

interface DiagnosieCode {
  code: string;
  diagnosies: Diagnosis[];
}

const styleForVisits = { p: 2, border: "2px solid black", borderRadius: 5 };

interface DisplayHealthRatingProps {
  healthCheckRating: HealthCheckRating;
}

const DisplayHealthRating = ({
  healthCheckRating,
}: DisplayHealthRatingProps) => {
  switch (healthCheckRating.toString()) {
    case "0":
      return <FavoriteIcon sx={{ color: "green" }} />;
    case "1":
      return <FavoriteIcon sx={{ color: "yellow" }} />;
    case "2":
      return <FavoriteIcon sx={{ color: "red" }} />;
    case "3":
      return <FavoriteIcon sx={{ color: "black" }} />;
    default:
      return <FavoriteIcon sx={{ color: "blue" }} />;
  }
};

const DisplayDiagnosis = ({ diagnosies, code }: DiagnosieCode) => {
  const getdiagnosyFromCode = (inputCode: string) => {
    const foundDiagnosy = diagnosies.find((diagnosyy) =>
      diagnosyy.code === inputCode ? true : false
    );
    if (foundDiagnosy) {
      return (
        <div>
          {foundDiagnosy.code}: {foundDiagnosy.name}
        </div>
      );
    } else {
      return <div>{code}: unknown diagnosy</div>;
    }
  };

  return <div>{getdiagnosyFromCode(code)}</div>;
};

const HospitalEntryComponent = ({ entry, diagnosies }: HospitalEntryProps) => {
  return (
    <Box sx={styleForVisits}>
      <Typography component="p">
        <LocalHospitalIcon />
        {entry.date}
      </Typography>
      <Typography> {entry.description}</Typography>
      <List sx={{ listStyleType: "disc" }}>
        {entry.diagnosisCodes?.map((code) => {
          return (
            <ListItem key={entry.id + code} sx={{ display: "list-item" }}>
              <DisplayDiagnosis diagnosies={diagnosies} code={code} />
            </ListItem>
          );
        })}
      </List>
      <Typography>
        released in: {entry.discharge.date}, {entry.discharge.criteria}
      </Typography>
      <Typography>Specialist: {entry.specialist}</Typography>
    </Box>
  );
};
const OccupationalHealthcareEntryComponent = ({
  entry,
  diagnosies,
}: OccupationalHealthcareProps) => {
  return (
    <Box sx={styleForVisits}>
      <Typography component="p">
        <AddBusinessIcon />
        {entry.date}
      </Typography>
      <Typography>Employer: {entry.employerName}</Typography>
      <Typography> {entry.description}</Typography>
      <List sx={{ listStyleType: "disc" }}>
        {entry.diagnosisCodes?.map((code) => {
          return (
            <ListItem key={entry.id + code} sx={{ display: "list-item" }}>
              <DisplayDiagnosis diagnosies={diagnosies} code={code} />
            </ListItem>
          );
        })}
      </List>
      <Typography>
        {entry.sickLeave?.startDate
          ? "the sick leave starts: " + entry.sickLeave?.startDate
          : ""}
      </Typography>
      <Typography>
        {entry.sickLeave?.endDate
          ? "the sick leave ends: " + entry.sickLeave?.endDate
          : ""}
      </Typography>
      <Typography>Specialist: {entry.specialist}</Typography>
    </Box>
  );
};
const HealthCheckEntryComponent = ({ entry, diagnosies }: HealthCheckProps) => {
  return (
    <Box sx={styleForVisits}>
      <Typography component="p">
        <CheckIcon />
        {entry.date}
      </Typography>
      <Typography> {entry.description}</Typography>
      <List sx={{ listStyleType: "disc" }}>
        {entry.diagnosisCodes?.map((code) => {
          return (
            <ListItem key={entry.id + code} sx={{ display: "list-item" }}>
              <DisplayDiagnosis diagnosies={diagnosies} code={code} />
            </ListItem>
          );
        })}
      </List>
      <DisplayHealthRating healthCheckRating={entry.healthCheckRating} />
      <Typography>Specialist: {entry.specialist}</Typography>
    </Box>
  );
};

const DisplayEntry = ({ entry, diagnosies }: SingleProps) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryComponent entry={entry} diagnosies={diagnosies} />;
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcareEntryComponent
          entry={entry}
          diagnosies={diagnosies}
        />
      );
    case "HealthCheck":
      return (
        <HealthCheckEntryComponent entry={entry} diagnosies={diagnosies} />
      );
    default:
      return (
        <Box>
          <Typography>unknown type of visit</Typography>
        </Box>
      );
  }
};

export const DisplayEntries = ({ diagnosies, entryList }: Props) => {
  return (
    <div>
      {entryList.map((entry: Entry) => {
        return (
          <div key={entry.id}>
            <DisplayEntry entry={entry} diagnosies={diagnosies} />
          </div>
        );
      })}
    </div>
  );
};
