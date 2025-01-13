const Header = (props) => {
  return (
    <div>
      <h1>name of the course is: {props.name}</h1>
    </div>
  );
};

const Content = (props) => {
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
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header name={course}></Header>
      <Content part={part1} exercise={exercises1}></Content>
      <Content part={part2} exercise={exercises2}></Content>
      <Content part={part3} exercise={exercises3}></Content>
      <Total ex1={exercises1} ex2={exercises2} ex3={exercises3}></Total>
    </div>
  );
};

export default App;
