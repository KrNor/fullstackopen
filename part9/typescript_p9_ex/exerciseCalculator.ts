import { makeStringListNumberList } from "./utils";

interface resultObject {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  providedArguments: string[]
): resultObject => {
  const argsThatAreNumbers: number[] =
    makeStringListNumberList(providedArguments);

  const target: number = argsThatAreNumbers[0];

  const days: number[] = argsThatAreNumbers.slice(1);

  const avg =
    days.reduce((accumulator, currentValue) => accumulator + currentValue) /
    days.length;

  const ratingAndDescription = {
    rating: 0,
    description: "",
    goalDone: false,
  };

  if (avg < target) {
    ratingAndDescription.rating = 1;
    ratingAndDescription.description = "not too bad but could be better";
    ratingAndDescription.goalDone = false;
  } else if (avg >= target && avg < target * 2) {
    ratingAndDescription.rating = 2;
    ratingAndDescription.description = "The goal was met, well done!";
    ratingAndDescription.goalDone = true;
  } else if (avg >= target * 2) {
    ratingAndDescription.rating = 3;
    ratingAndDescription.description = "The goal was overshot by alot!";
    ratingAndDescription.goalDone = true;
  } else {
    throw new Error(
      "something went wrong with calculating exercise averages, entered values might be unrealistic"
    );
  }

  //   console.log(avg);
  const objectToReturn = {
    periodLength: days.length,
    trainingDays: days.filter((hours) => hours > 0).length,
    success: ratingAndDescription.goalDone,
    rating: ratingAndDescription.rating,
    ratingDescription: ratingAndDescription.description,
    target: target,
    average: avg,
  };
  return objectToReturn;
};

if (require.main === module) {
  try {
    //   console.log(process.argv);
    if (process.argv.length > 3) {
      console.log(calculateExercises(process.argv.slice(2)));
    } else {
      throw new Error("The wrong ammount of arguments were provided");
    }
  } catch (error: unknown) {
    let errMessage = "Something wrong happened: ";
    if (error instanceof Error) {
      errMessage += error.message;
    } else {
      errMessage += "unknown error";
    }
    console.log(errMessage);
  }
}
