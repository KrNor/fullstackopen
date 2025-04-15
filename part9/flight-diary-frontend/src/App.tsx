import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3001/api/diaries";
interface Diary {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

interface NewDiary {
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

interface ErrMessage {
  errMessage: string;
}

interface ErrMessageSetter {
  setErrMessage: React.Dispatch<React.SetStateAction<string>>;
}

const createDiary = async (object: NewDiary) => {
  return axios.post<NewDiary>(baseUrl, object).then((response) => {
    console.log(response.data);
  });
};

const AddDiary: React.FC<ErrMessageSetter> = ({ setErrMessage }) => {
  const [dateValue, setDateValue] = useState<string>("");
  const [weatherValue, setWeatherValue] = useState<string>("");
  const [visibilityValue, setVisibilityValue] = useState<string>("");
  const [commentValue, setCommentValue] = useState<string>("");

  const SubmitTheDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryObject = {
      date: dateValue,
      weather: weatherValue,
      visibility: visibilityValue,
      comment: commentValue,
    };

    try {
      const returnedDiary = await createDiary(diaryObject);
      console.log(returnedDiary);

      setDateValue("");
      setWeatherValue("");
      setVisibilityValue("");
      setCommentValue("");
      window.location.reload();
    } catch (error) {
      // I don't like this but it works
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.error[0].message);
        setErrMessage(error.response?.data.error[0].message);

        setTimeout(() => {
          setErrMessage("");
        }, 5000);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <form onSubmit={SubmitTheDiary}>
        <div>
          <div>
            <p>the date is:</p>
            <input
              type="text"
              value={dateValue}
              onChange={({ target }) => setDateValue(target.value)}
            />
          </div>
          <p>the visibility is:</p>
          <div>
            <input
              type="text"
              value={visibilityValue}
              onChange={({ target }) => setVisibilityValue(target.value)}
            />
          </div>
          <p>the weather is:</p>
          <div>
            <input
              type="text"
              value={weatherValue}
              onChange={({ target }) => setWeatherValue(target.value)}
            />
          </div>
          <p>comment is:</p>
          <div>
            <input
              type="text"
              value={commentValue}
              onChange={({ target }) => setCommentValue(target.value)}
            />
          </div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const StatusMessage: React.FC<ErrMessage> = ({ errMessage }) => {
  const statusStyle = {
    color: "red",
  };
  return <div style={{ ...statusStyle }}>{errMessage}</div>;
};

const App: React.FC = () => {
  const [errMessage, setErrMessage] = useState<string>("");
  const [diaries, setDiaries] = useState<Diary[]>([
    {
      id: 1,
      date: "2017-01-01",
      weather: "rainy",
      visibility: "poor",
    },
  ]);

  useEffect(() => {
    axios
      .get<Diary[]>("http://localhost:3001/api/diaries")
      .then((response) => {
        setDiaries(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <AddDiary setErrMessage={setErrMessage} />
      <StatusMessage errMessage={errMessage} />
      {diaries.map((element: Diary) => {
        if (element.comment) {
          return (
            <div key={element.id}>
              <h3>{element.date}</h3>
              <p>the visibility was: {element.visibility}</p>
              <p>the weather was: {element.weather}</p>
              <p>notes: {element.comment}</p>
            </div>
          );
        } else {
          return (
            <div key={element.id}>
              <h3>{element.date}</h3>
              <p>the visibility was: {element.visibility}</p>
              <p>the weather was: {element.weather}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default App;
