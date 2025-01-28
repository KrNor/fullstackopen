const Header = (props) => {
  return (
    <div>
      <h1>name of the course is: {props.course}</h1>
    </div>
  );
};

const Content = (props) => {
  return (
    <>
      {props.parts.map((partt) => (
        <Part key={partt.id} part={partt.name} exercise={partt.exercises} />
      ))}
    </>
  );
};

const Part = (props) => {
  return (
    <p>
      Part "{props.part}" contains: {props.exercise} exercises.
    </p>
  );
};

const Total = (props) => {
  var totalExercises = 0;
  return (
    <b>
      total of{" "}
      {props.parts.map((partt) => partt.exercises).reduce((a, b) => a + b, 0)}{" "}
      exercises
    </b>
  );
};
const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  );
};

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "procrastination",
        exercises: 20,
        id: 4,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
