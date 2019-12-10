const getRandomArrayItem = (arr) => {
  const arrayIndex = Math.round(Math.random() * (arr.length - 1));

  return arr[arrayIndex];
};

const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export {getRandomArrayItem, getRandomInteger};
