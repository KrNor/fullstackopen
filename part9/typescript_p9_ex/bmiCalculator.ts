import { makeThisANumber } from "./utils";

export const calculateBmi = (height: string, weight: string): string => {
  const parsedHeight = makeThisANumber(height);

  const parsedWeight = makeThisANumber(weight);

  if (isNaN(parsedHeight) || isNaN(parsedWeight)) {
    throw new Error("Non number values were entered");
  }

  if (parsedHeight <= 0 || parsedWeight <= 0) {
    throw new Error("The values have to be somewhat realistic...");
  }

  const bmi = (parsedWeight / (parsedHeight * parsedHeight)) * 10000;

  // console.log(bmi);

  if (bmi < 16) {
    return "Underweight (Severe thinness)";
  } else if (bmi < 17) return "Underweight (Moderate thinness)";
  else if (bmi < 18.5) return "Underweight (Mild thinness)";
  else if (bmi < 25) return "Normal range";
  else if (bmi < 30) return "Overweight (Pre-obese)";
  else if (bmi < 35) return "Obese (Class I)";
  else if (bmi < 40) return "Obese (Class II)";
  else if (bmi >= 40) return "Obese (Class III)";

  throw new Error("calculating the bmi failed, possibly unrealistic values");
};

if (require.main === module) {
  try {
    if (process.argv.length === 4) {
      console.log(calculateBmi(process.argv[2], process.argv[3]));
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
