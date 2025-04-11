import { useState, useEffect } from "react";
import { coursePartData } from "./data";
import {
  CoursePart,
  CourseNameProps,
  ContentProps,
  CourseTotalExerciseProps,
} from "./types";

const Header = (props: CourseNameProps) => {
  return <h1>{props.name}</h1>;
};

const Part = (props: CoursePart) => {
  switch (props.kind) {
    case "basic":
      return (
        <div>
          <h3>
            {props.name} {props.exerciseCount}
          </h3>
          <p>{props.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>
            {props.name} {props.exerciseCount}
          </h3>
          <p>Exercise count: {props.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>
            {props.name} {props.exerciseCount}
          </h3>
          <i>{props.description}</i>
          <p>{props.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>
            {props.name} {props.exerciseCount}
          </h3>
          <i>{props.description}</i>
          <p>the required skills are : {props.requirements.toString()}</p>
        </div>
      );
    default:
      break;
  }
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((element: CoursePart) => {
        switch (element.kind) {
          case "basic":
            return (
              <Part
                key={element.name}
                name={element.name}
                exerciseCount={element.exerciseCount}
                description={element.description}
                kind={element.kind}
              />
            );
            break;
          case "group":
            return (
              <Part
                key={element.name}
                name={element.name}
                exerciseCount={element.exerciseCount}
                groupProjectCount={element.groupProjectCount}
                kind={element.kind}
              />
            );
            break;
          case "background":
            return (
              <Part
                key={element.name}
                name={element.name}
                exerciseCount={element.exerciseCount}
                description={element.description}
                kind={element.kind}
                backgroundMaterial={element.backgroundMaterial}
              />
            );
            break;
          case "special":
            return (
              <Part
                key={element.name}
                name={element.name}
                exerciseCount={element.exerciseCount}
                description={element.description}
                requirements={element.requirements}
                kind={element.kind}
              />
            );
            break;
          default:
            break;
        }
      })}
    </div>
  );
};
const Total = (props: CourseTotalExerciseProps) => {
  return <h2>The Total number of exercises {props.totalExerciseCount}</h2>;
};
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
