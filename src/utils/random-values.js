const getRandomArrayItem = (arr) => {
  const arrayIndex = Math.round(Math.random() * (arr.length - 1));

  return arr[arrayIndex];
};

const getRandomInteger = (min, max) => {
  return min + Math.round(Math.random() * (max - min));
};

export {getRandomArrayItem, getRandomInteger};
