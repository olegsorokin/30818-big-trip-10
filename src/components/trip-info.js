import {getTripInfo} from '../mock/trip-info';
import {formatShortDate} from '../utils/format-time';
import AbstractComponent from './abstract-component';

const createInfoTemplate = (tripEvents) => {
  if (!tripEvents || !tripEvents.length) {
    return ` `;
  }

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

export default class Sort extends AbstractComponent {
  constructor(tripEvents) {
    super();

    this._tripEvents = tripEvents;
  }

  getTemplate() {
    return createInfoTemplate(this._tripEvents);
  }
}
