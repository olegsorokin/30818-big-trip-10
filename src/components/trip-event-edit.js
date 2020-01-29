import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {transferTypes, activityTypes, destinations, offers as offersList} from '../const';
import AbstractSmartComponent from './abstract-smart-component';
import {getOffers, getDescription} from '../mock/trip-event';

const createTypeGroupMarkup = (title, types, currentType, index) => {
  const list = types.map((type) => {
    const typeId = type.toLowerCase();
    const checked = currentType === typeId ? `checked` : ``;

    return (
      `<div class="event__type-item">
        <input id="event-type-${typeId}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeId}" ${checked}>
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

const createTypeListMarkup = (type, index) => {
  return (
    `<div class="event__type-list">
      ${createTypeGroupMarkup(`Transfer`, transferTypes, type, index)}
      ${createTypeGroupMarkup(`Activity`, activityTypes, type, index)}
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

const createFavoriteButtonMarkup = (isFavorite) => {
  const checked = isFavorite ? `checked` : ``;

  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${checked}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
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

const createFormTripEventTemplate = (tripEvent, index = 1, options = {}) => {
  const {date, price, photos} = tripEvent;
  const {type, city, description, offers, isFavorite} = options;
  const typeId = type.toLowerCase();
  const startDate = date.start;
  const endDate = date.end;

  const favoriteButton = createFavoriteButtonMarkup(isFavorite);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${index}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeId}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${index}" type="checkbox">

          ${createTypeListMarkup(typeId, index)}
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
        <button class="event__reset-btn" type="reset">Delete</button>

        ${favoriteButton}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
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

const parseFormData = (formData) => {
  return {
    type: transferTypes[0],
    city: ``,
    photos: [],
    description: ``,
    date: {
      start: null,
      end: null
    },
    price: 0,
    offers: [],
    isFavorite: false
  };
};

export default class TripEventForm extends AbstractSmartComponent {
  constructor(tripEvent, tripEventIndex) {
    super();

    this._tripEvent = tripEvent;
    this._tripEventIndex = tripEventIndex;

    this._type = tripEvent.type;
    this._city = tripEvent.city;
    this._description = tripEvent.description;
    this._offers = Object.assign({}, tripEvent.offers);
    this._isFavorite = tripEvent.isFavorite;

    this._onSubmitHandler = null;
    this._onRollupButtonClickHandler = null;
    this._onDeleteButtonClickHandler = null;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createFormTripEventTemplate(this._tripEvent, this._tripEventIndex, {
      type: this._type,
      city: this._city,
      description: this._description,
      offers: this._offers,
      isFavorite: this._isFavorite
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._onSubmitHandler);
    this.setRollupButtonClickHandler(this._onRollupButtonClickHandler);
    this.setDeleteButtonClickHandler(this._onDeleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);

    this._onRollupButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._onSubmitHandler = handler;
  }

  setFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, handler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._onDeleteButtonClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    const dateStartElement = this.getElement().querySelector(`input[name="event-start-time"]`);
    this._flatpickrStart = flatpickr(dateStartElement, {
      allowInput: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._tripEvent.date.start || new Date(),
      enableTime: true,
    });

    const dateEndElement = this.getElement().querySelector(`input[name="event-end-time"]`);
    this._flatpickrEnd = flatpickr(dateEndElement, {
      allowInput: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._tripEvent.date.end || new Date(),
      enableTime: true,
      minDate: this._tripEvent.date.start
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-group`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this._offers = getOffers();

      this.rerender();
    });

    element.querySelector(`.event__favorite-checkbox`).addEventListener(`change`, (evt) => {
      this._isFavorite = evt.target.checked;

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      if (destinations.some((el) => el === evt.target.value)) {
        this._city = evt.target.value;
        this._description = getDescription();

        this.rerender();
      }
    });
  }
}
