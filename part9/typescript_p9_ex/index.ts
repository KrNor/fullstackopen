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
      const currHeight: string = JSON.stringify(req.query.height);
      const currWeight: string = JSON.stringify(req.query.weight);
      const returnedBmiStatus = calculateBmi(currHeight, currWeight);
      res.json({
        height: currHeight,
        weight: currWeight,
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
