import {getTripInfo} from '../mock/trip-info';
import {formatShortDate} from '../utils/format-time';
import {createElement} from '../utils';

const createInfoTemplate = (tripEvents) => {
  const createTitleMarkup = () => {
    const cities = getTripInfo(tripEvents).cities;
    const lastIndexOfCities = cities.length - 1;

    return cities.length > 3
      ? `${cities[0]} &mdash; ... &mdash; ${cities[lastIndexOfCities]}`
      : cities.join(` &mdash; `);
  };

  const createDatesMarkup = ({start, end}) => {
    const startDate = formatShortDate(start);
    const endDate = formatShortDate(end);

    return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
  };

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createTitleMarkup()}</h1>

      <p class="trip-info__dates">${createDatesMarkup(getTripInfo(tripEvents).date)}</p>
    </div>`
  );
};

export default class Sort {
  constructor(tripEvents) {
    this._tripEvents = tripEvents;
    this._element = null;
  }

  getTemplate() {
    return createInfoTemplate(this._tripEvents);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
