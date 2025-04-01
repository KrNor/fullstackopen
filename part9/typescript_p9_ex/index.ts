import express from "express";
import qs from "qs";
import { calculateBmi } from "./bmiCalculator";
const app = express();

app.set("query parser", (str: string) => qs.parse(str));

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  if (req.query.height && req.query.weight) {
    try {
      const returnedBmiStatus = calculateBmi(
        req.query.height.toString(),
        req.query.weight.toString()
      );
      res.json({
        weight: req.query.weight.toString(),
        height: req.query.height.toString(),
        bmi: returnedBmiStatus,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.json({
          error: error.message,
        });
      } else {
        res.json({
          error: "unknown error",
        });
      }
    }
  } else {
    res.json({ error: `malformatted parameters` });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
