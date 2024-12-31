import { faker } from "@faker-js/faker";

export const getWord = (number: number) => {
  return faker.word.words(number).split(" ");
};
