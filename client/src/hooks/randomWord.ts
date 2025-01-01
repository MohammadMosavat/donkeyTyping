import { faker } from "@faker-js/faker";

export const getWord = (number: number) => {
  console.log(faker.word.words(number).split(" "))

  return faker.word.words(number).split(" ");
};
