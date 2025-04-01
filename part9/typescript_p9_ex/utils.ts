export const makeThisANumber = (stringToParse: string): number => {
  return Number(stringToParse);
};
export const makeStringListNumberList = (stringList: string[]): number[] => {
  const listToReturn: number[] = [];

  stringList.forEach((potentialNumber) => {
    const parsedNum = makeThisANumber(potentialNumber);
    if (isNaN(parsedNum)) {
      throw new Error("Non number value was entered");
    } else {
      listToReturn.push(parsedNum);
    }
  });
  return listToReturn;
};
