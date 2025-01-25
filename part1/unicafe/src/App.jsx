import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.name}</button>;
};

const StatisticLine = (props) => {
  if (props.name == "avg") {
    const feedbackResult =
      Math.round(
        ((props.goodFb * 1 + props.badFb * -1) / props.addedFb || 0) * 100
      ) / 100;

    return (
      <tr>
        <td>average </td>
        <td>{feedbackResult}</td>
      </tr>
    );
  } else if (props.name == "pos") {
    const positiveFb =
      Math.round(((props.goodFb / props.addedFb) * 100 || 0) * 100) / 100;
    return (
      <tr>
        <td>positive </td>
        <td>{positiveFb}%</td>
      </tr>
    );
  }
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.count}</td>
    </tr>
  );
};
const Statistics = (props) => {
  if (props.all < 1) {
    return <p>no feedback has been given</p>;
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine name="good" count={props.good} />
          <StatisticLine name="neutral" count={props.neutral} />
          <StatisticLine name="bad" count={props.bad} />
          <StatisticLine name="all" count={props.all} />
          <StatisticLine
            name="avg"
            addedFb={props.all}
            goodFb={props.good}
            badFb={props.bad}
          />
          <StatisticLine name="pos" addedFb={props.all} goodFb={props.good} f />
        </tbody>
      </table>
    </div>
  );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
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
