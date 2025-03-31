// calculateExercises;
// Write a function calculateExercises that calculates the average time of daily exercise hours, compares it to the target amount of daily hours and returns an object that includes the following values:

//     the number of days // totalDays
//     the number of training days // totalTrainingDays
//     the original target value // originalTarget
//     the calculated average time // calculatedAverage
//     boolean value describing if the target was reached
//     a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.
//     a text value explaining the rating, you can come up with the explanations

interface resultObject {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (days: number[], target: number): resultObject => {
  // avg < target = not met goal
  // avg > target < avg*2 = goal met good job
  // avg*2 > target = wow you doubled your target
  const avg =
    days.reduce((accumulator, currentValue) => accumulator + currentValue) /
    days.length;

  let ratingAndDescription = {
    rating: 0,
    description: "",
    goalDone: false,
  };
  if (avg < target) {
    (ratingAndDescription.rating = 1),
      (ratingAndDescription.description = "not too bad but could be better"),
      (ratingAndDescription.goalDone = false);
  } else if (avg > target && avg < target * 2) {
    (ratingAndDescription.rating = 2),
      (ratingAndDescription.description = "The goal was met, well done!"),
      (ratingAndDescription.goalDone = true);
  } else if (avg > target * 2) {
    (ratingAndDescription.rating = 3),
      (ratingAndDescription.description = "The goal was overshot by alot!"),
      (ratingAndDescription.goalDone = true);
  } else {
    console.log("something went horribly wrong");
  }

  //   console.log(avg);
  let objectToReturn = {
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
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
