import { useEffect, useState } from "react";
import axios from "axios";
import { Diary, NewDiary, ErrMessage, ErrMessageSetter } from "./types";

const usedUrl = "http://localhost:3001/api/diaries";

const createDiary = async (object: NewDiary) => {
  return axios.post<NewDiary>(usedUrl, object).then((response) => {
    console.log(response.data);
  });
};

const AddDiary: React.FC<ErrMessageSetter> = ({ setErrMessage }) => {
  const [dateValue, setDateValue] = useState<string>("2025-01-01");
  const [weatherValue, setWeatherValue] = useState<string>("sunny");
  const [visibilityValue, setVisibilityValue] = useState<string>("great");
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
      // const returnedDiary = await createDiary(diaryObject);
      // console.log(returnedDiary);
      await createDiary(diaryObject);
      setDateValue("");
      setWeatherValue("");
      setVisibilityValue("");
      setCommentValue("");
      window.location.reload();
    } catch (error) {
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
      <h1>Add a diary:</h1>
      <form onSubmit={SubmitTheDiary}>
        <div>
          <div>
            <p>the date is:</p>
            <input
              type="date"
              value={dateValue}
              min="2000-01-01"
              max="2060-01-01"
              onChange={({ target }) => setDateValue(target.value)}
            />
          </div>

          <p>the visibility is:</p>
          <fieldset>
            <div>
              <label>great</label>
              <input
                type="radio"
                id="visibilityGreat"
                name="visibility"
                value="great"
                defaultChecked
                onClick={() => setVisibilityValue("great")}
              />
              |<label>good</label>
              <input
                type="radio"
                id="visibilityGood"
                name="visibility"
                value="good"
                onClick={() => setVisibilityValue("good")}
              />
              |<label>ok</label>
              <input
                type="radio"
                id="visibilityOk"
                name="visibility"
                value="ok"
                onClick={() => setVisibilityValue("ok")}
              />
              |<label>poor</label>
              <input
                type="radio"
                id="visibilityPoor"
                name="visibility"
                value="poor"
                onClick={() => setVisibilityValue("poor")}
              />
            </div>
          </fieldset>
          <p>the weather is:</p>
          <fieldset>
            <div>
              <label>sunny</label>
              <input
                type="radio"
                id="weatherSunny"
                name="weather"
                value="sunny"
                defaultChecked
                onClick={() => setWeatherValue("sunny")}
              />
              |<label>rainy</label>
              <input
                type="radio"
                id="weatherRainy"
                name="weather"
                value="rainy"
                onClick={() => setWeatherValue("rainy")}
              />
              |<label>windy</label>
              <input
                type="radio"
                id="weatherWindy"
                name="weather"
                value="windy"
                onClick={() => setWeatherValue("windy")}
              />
              |<label>cloudy</label>
              <input
                type="radio"
                id="weatherCloudy"
                name="weather"
                value="cloudy"
                onClick={() => setWeatherValue("cloudy")}
              />
              |<label>stormy</label>
              <input
                type="radio"
                id="weatherStormy"
                name="weather"
                value="stormy"
                onClick={() => setWeatherValue("stormy")}
              />
            </div>
          </fieldset>
          <p>The comment is:</p>
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
      <h1>Diary list:</h1>
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
