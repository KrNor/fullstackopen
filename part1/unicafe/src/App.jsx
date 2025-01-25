import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.name}</button>;
};

const Counter = (props) => {
  return (
    <p>
      {props.name} {props.count}
    </p>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={() => setGood(good + 1)} name="good" count={good} />
      <Button
        onClick={() => setNeutral(neutral + 1)}
        name="neutral"
        count={neutral}
      />
      <Button onClick={() => setBad(bad + 1)} name="bad" count={bad} />
      <h1>statistics</h1>
      <Counter name="good" count={good} />
      <Counter name="neutral" count={neutral} />
      <Counter name="bad" count={bad} />
    </div>
  );
};

export default App;
