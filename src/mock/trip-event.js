import {getRandomArrayItem, getRandomInteger} from '../utils/random-values';
import {transferTypes, activityTypes, destinations, offers} from '../const';

const getType = () => {
  return getRandomArrayItem([...transferTypes, ...activityTypes]);
};

const getCity = () => {
  return getRandomArrayItem(destinations);
};

const getPhotos = () => {
  const getPhoto = () => `http://picsum.photos/300/150?r=${Math.random()}`;
  const getPhotosCount = () => getRandomInteger(0, 5);

  return new Array(getPhotosCount())
    .fill(``)
    .map(() => getPhoto());
};

const getDescription = () => {
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const descriptions = description.match(/\w+[\w\s,]+\./g);
  const getSentencesCount = () => getRandomInteger(1, 3);

  return Array.from(new Set(new Array(getSentencesCount())
    .fill(``)
    .map(() => getRandomArrayItem(descriptions))))
    .join(` `);
};

const getDate = () => {
  const ONE_DAY_IN_MINUTES = 24 * 60;

  const currentDate = new Date();
  const startDate = currentDate.setMinutes(currentDate.getMinutes() + getRandomInteger(100, ONE_DAY_IN_MINUTES * 3));
  const endDate = new Date(startDate)
    .setMinutes(currentDate.getMinutes() + getRandomInteger(10, ONE_DAY_IN_MINUTES * 3));

  return {
    start: startDate,
    end: endDate
  };
};

const getPrice = () => {
  return getRandomInteger(10, 950);
};

const getOffers = () => {
  const getOffersCount = () => getRandomInteger(0, 2);
  const getOffer = () => getRandomArrayItem(offers);

  return new Set(new Array(getOffersCount())
    .fill(``)
    .map(() => getOffer()));
};

const createTripEvent = () => {
  return ({
    id: String(Date.now() + Math.random()),
    type: getType(),
    city: getCity(),
    photos: getPhotos(),
    description: getDescription(),
    date: getDate(),
    price: getPrice(),
    offers: getOffers(),
    isFavorite: false
  });
};

const createTripEvents = (count) => {
  return (
    new Array(count)
      .fill(``)
      .map(() => createTripEvent())
  );
};

export {createTripEvents, getOffers, getDescription};
