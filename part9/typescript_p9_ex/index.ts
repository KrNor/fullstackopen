/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from "express";
import qs from "qs";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

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

app.post("/exercises", (req, res) => {
  // console.log(req.body);
  if (req.body.daily_exercises && req.body.target) {
    try {
      const currDailyExercises: string[] = req.body.daily_exercises;
      const currTarget: string = JSON.stringify(req.body.target);
      if (currDailyExercises.length > 0) {
        const objectToReturn = calculateExercises([
          currTarget,
          ...currDailyExercises,
        ]);
        res.json({ objectToReturn });
      } else {
        res.json({ error: "malformatted parameters" }); // this could be parameters missing, but I'm leaning more torwards malformed
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Non number value was entered") {
          res.json({ error: "malformatted parameters" });
        } else {
          // this shouldn't happen, but in case it does, we get a usefull error message
          res.json({
            error: error.message,
          });
        }
      } else {
        res.json({
          error: "unknown error",
        });
      }
    }
  } else {
    res.json({ error: "parameters missing" });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
