import {formatTime, formatDiff, formatDatetime} from '../utils/format-time';
import AbstractComponent from './abstract-component';

const getTimeMarkup = (startDate, endDate) => {
  return (
    `<div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${formatDatetime(startDate)}">${formatTime(startDate)}</time>
        &mdash;
        <time class="event__end-time" datetime="${formatDatetime(endDate)}">${formatTime(endDate)}</time>
      </p>
      <p class="event__duration">${formatDiff(startDate, endDate)}</p>
    </div>`
  );
};

const getOffersMarkup = (offers) => {
  const offersMarkup = [...offers].map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
       </li>`
    );
  }).join(`\n`);

  return offers.size ? `<ul class="event__selected-offers">${offersMarkup}</ul>` : ``;
};

const createTripEventTemplate = ({type, date, price, offers}) => {
  const typeId = type.toLowerCase();

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeId}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">Taxi to airport</h3>

        ${getTimeMarkup(date.start, date.end)}

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        ${getOffersMarkup(offers)}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEventForm extends AbstractComponent {
  constructor(tripEvent) {
    super();

    this._tripEvent = tripEvent;
  }

  getTemplate() {
    return createTripEventTemplate(this._tripEvent);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
