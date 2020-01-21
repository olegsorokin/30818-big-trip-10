import {isFutureDate, isPastDate} from './format-time.js';
import {FilterType} from '../const.js';

export const getEverythingPoints = (points) => {
  return points.filter((point) => point);
};

export const getFuturePoints = (points) => {
  return points.filter((point) => isFutureDate(point.date.start));
};

export const getPastPoints = (points) => {
  return points.filter((point) => isPastDate(point.date.start));
};

export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return getEverythingPoints(points);
    case FilterType.FUTURE:
      return getFuturePoints(points);
    case FilterType.PAST:
      return getPastPoints(points);
  }

  return points;
};
