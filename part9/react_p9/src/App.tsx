import { useState, useEffect } from "react";
import { coursePartData } from "./data";

const Header = (props: CourseNameProps) => {
  return <div>{props.name}</div>;
};
const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((element: CoursePartProps) => {
        return (
          <p>
            {element.name} {element.exerciseCount}
          </p>
        );
      })}
    </div>
  );
};
const Total = (props: CourseTotalExerciseProps) => {
  return <div>Number of exercises {props.totalExerciseCount}</div>;
};

interface CourseNameProps {
  name: string;
}

interface CoursePartProps {
  exerciseCount: number;
  name: string;
}

interface ContentProps {
  courseParts: CoursePartProps[];
}
interface CourseTotalExerciseProps {
  totalExerciseCount: number;
}

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [courseName, _setCourseName] = useState(
    "Half Stack application development"
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [courseParts, _setCourseParts] = useState(coursePartData);
  const [totalExercises, setTotalExercises] = useState(0);

  useEffect(() => {
    setTotalExercises(
      courseParts.reduce((sum, part) => sum + part.exerciseCount, 0)
    );
  }, [courseParts]);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExerciseCount={totalExercises} />
    </div>
  );
};

export default App;
