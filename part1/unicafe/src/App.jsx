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

const AverageFeedback = (props) => {
  const feedbackResult =
    (props.goodFb * 1 + props.badFb * -1) / props.addedFb || 0;
  return <p>average {feedbackResult}</p>;
};

const PositiveFeedback = (props) => {
  const positiveFb = (props.goodFb / props.addedFb) * 100 || 0;
  return <p>positive {positiveFb}%</p>;
};

const Statistics = (props) => {
  if (props.all < 1) {
    return <p>no feedback has been given</p>;
  }
  return (
    <div>
      <h1>statistics</h1>
      <Counter name="good" count={props.good} />
      <Counter name="neutral" count={props.neutral} />
      <Counter name="bad" count={props.bad} />
      <p>all {props.all}</p>
      <AverageFeedback
        addedFb={props.all}
        goodFb={props.good}
        badFb={props.bad}
      />
      <PositiveFeedback addedFb={props.all} goodFb={props.good} />
    </div>
  );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  // AddedFeedback
  // AverageFeedback
  // % of positive feedback
  return (
    <div>
      <h1>give feedback</h1>

      <Button
        onClick={() => {
          setGood(good + 1), setAll(all + 1);
        }}
        name="good"
        count={good}
      />
      <Button
        onClick={() => {
          setNeutral(neutral + 1), setAll(all + 1);
        }}
        name="neutral"
        count={neutral}
      />
      <Button
        onClick={() => {
          setBad(bad + 1), setAll(all + 1);
        }}
        name="bad"
        count={bad}
      />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  );
};

export default App;
