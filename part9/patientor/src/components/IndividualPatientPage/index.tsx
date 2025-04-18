import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { Patient, Gender, Entry } from "../../types";
import { Typography, Alert, List, ListItem } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import axios from "axios";

interface Genders {
  gender: Gender;
}

interface Props {
  entryList: Entry[];
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

const DisplayEntries = ({ entryList }: Props) => {
  // console.log(entryList);
  //  date, description and diagnoseCodes
  return (
    <div>
      {entryList.map((entry: Entry) => {
        return (
          <div key={entry.id}>
            <Typography component="p">
              {entry.date}: {entry.description}
            </Typography>
            <List sx={{ listStyleType: "disc" }}>
              {entry.diagnosisCodes?.map((code) => {
                return (
                  <ListItem key={entry.id + code} sx={{ display: "list-item" }}>
                    {code}
                  </ListItem>
                );
              })}
            </List>
          </div>
        );
      })}
    </div>
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
  const [error, setError] = useState<string>();

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
    getPerson();
  }, [id]);

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h5">
        {patient.name} <DisplayGender gender={patient.gender} />
      </Typography>

      <Typography component="p">ssn: {patient.ssn}</Typography>
      <Typography component="p">occupation: {patient.occupation}</Typography>
      <Typography variant="h5">Entries: </Typography>
      {patient.entries.length > 0 ? (
        <DisplayEntries entryList={patient.entries} />
      ) : (
        <Typography component="p">none</Typography>
      )}
    </div>
  );
};

export default IndividualPatientPage;
