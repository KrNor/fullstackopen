const Header = (props) => {
  return (
    <div>
      <h2>name of the course is: {props.course}</h2>
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

export default Course;
