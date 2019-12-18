import {transferTypes, activityTypes, destinations, offers as offersList} from '../const';
import {formatInputDate} from '../utils/format-time';
import AbstractComponent from './abstract-component';

const createTypeGroupMarkup = (title, types, index) => {
  const list = types.map((type) => {
    const typeId = type.toLowerCase();

    return (
      `<div class="event__type-item">
        <input id="event-type-${typeId}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeId}">
        <label class="event__type-label  event__type-label--${typeId}" for="event-type-${typeId}-${index}">${type}</label>
      </div>`
    );
  }).join(`\n`);

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${title}</legend>
      ${list}
    </fieldset>`
  );
};

const createTypeListMarkup = (index) => {
  return (
    `<div class="event__type-list">
      ${createTypeGroupMarkup(`Transfer`, transferTypes, index)}
      ${createTypeGroupMarkup(`Activity`, activityTypes, index)}
    </div>`
  );
};

const createDestinationList = (city, index) => {
  const list = destinations.map((destination) => {
    return `<option value="${destination}"></option>`;
  }).join(`\n`);

  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${index}">
        Sightseeing at
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${index}" type="text" name="event-destination" value="${city}" list="destination-list-${index}">
      <datalist id="destination-list-${index}">
        ${list}
      </datalist>
    </div>`
  );
};

const createPhotosMarkup = (photos) => {
  const list = photos.map((photo) => {
    return `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }).join(`\n`);

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${list}
      </div>
    </div>`
  );
};

const createOffersMarkup = (offers, index) => {
  const list = offersList.map(({type, title, price}) => {
    const checked = offers.size && [...offers].find((offer) => offer.title === title) ? `checked` : ``;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}" ${checked}>
        <label class="event__offer-label" for="event-offer-${type}-${index}">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);

  return (
    `<div class="event__available-offers">
      ${list}
    </div>`
  );
};

const createFormTripEventTemplate = ({type, city, description, date, price, photos, offers}, index = 1) => {
  const typeId = type.toLowerCase();
  const startDate = formatInputDate(date.start);
  const endDate = formatInputDate(date.end);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${index}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeId}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${index}" type="checkbox">

          ${createTypeListMarkup(index)}
        </div>

        ${createDestinationList(city, index)}

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${index}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${index}" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${index}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${index}" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${index}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${index}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          ${createOffersMarkup(offers, index)}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          ${createPhotosMarkup(photos)}
        </section>
      </section>
    </form>`
  );
};

export default class TripEventForm extends AbstractComponent {
  constructor(tripEvent, tripEventIndex) {
    super();

    this._tripEvent = tripEvent;
    this._tripEventIndex = tripEventIndex;
  }

  getTemplate() {
    return createFormTripEventTemplate(this._tripEvent, this._tripEventIndex);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }
}
