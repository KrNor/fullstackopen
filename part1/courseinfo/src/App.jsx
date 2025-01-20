const Header = (props) => {
  return (
    <div>
      <h1>name of the course is: {props.name}</h1>
    </div>
  );
};

const Content = (props) => {
  return (
    <>
      <Part part={props.part1} exercise={props.exercises1} />
      <Part part={props.part2} exercise={props.exercises2} />
      <Part part={props.part3} exercise={props.exercises3} />
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
  return <p>Number of exercises {props.ex1 + props.ex2 + props.ex3}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = {
    name: "Fundamentals of React",
    exercises: 10,
  };
  const part2 = {
    name: "Using props to pass data",
    exercises: 7,
  };
  const part3 = {
    name: "State of a component",
    exercises: 14,
  };
  return (
    <div>
      <Header name={course}></Header>
      <Content
        part1={part1.name}
        part2={part2.name}
        part3={part3.name}
        exercises1={part1.exercises}
        exercises2={part2.exercises}
        exercises3={part3.exercises}
      ></Content>
      <Total
        ex1={part1.exercises}
        ex2={part2.exercises}
        ex3={part3.exercises}
      ></Total>
    </div>
  );
};

export default App;
