import { useEffect, useState } from "react";
import axios from "axios";

interface Diary {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

function App() {
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
}

export default App;
