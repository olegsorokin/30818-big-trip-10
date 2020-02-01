import TripEventComponent from '../components/trip-event';
import TripEventFormComponent from '../components/trip-event-edit';
import {render, RenderPosition, replace, remove} from '../utils/render';
import AbstractSmartComponent from '../components/abstract-smart-component';
import {transferTypes} from '../const';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyEvent = {
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

export default class PointController extends AbstractSmartComponent {
  constructor(container, onDataChange, onViewChange) {
    super();

    this._mode = Mode.DEFAULT;

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._tripEventComponent = null;
    this._tripEventFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent, mode) {
    this._mode = mode;
    this._tripEventComponent = new TripEventComponent(tripEvent);
    this._tripEventFormComponent = new TripEventFormComponent(tripEvent, mode);

    this._tripEventComponent.setRollupButtonClickHandler(() => {
      this._replaceTripEventToForm();
    });

    this._tripEventFormComponent.setRollupButtonClickHandler(() => {
      this._replaceFormToTripEvent();
    });

    this._tripEventFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._tripEventFormComponent.getData();

      switch (this._mode) {
        case Mode.ADDING:
          this._onDataChange(this, null, data);
          break;
        case Mode.EDIT:
          this._onDataChange(this, tripEvent, data);
          break;
      }

      this._replaceFormToTripEvent();
    });

    this._tripEventFormComponent.setDeleteButtonClickHandler(() => {
      switch (this._mode) {
        case Mode.ADDING:
          this._onDataChange(this, null, null);
          this.destroy();
          break;
        case Mode.EDIT:
          this._onDataChange(this, tripEvent, null);
          break;
      }
    });

    this._tripEventFormComponent.setFavoriteChangeHandler((evt) => {
      this._onDataChange(this, tripEvent, Object.assign({}, tripEvent, {
        isFavorite: evt.target.value
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
        break;
      case Mode.ADDING:
        document.addEventListener(`keydown`, this._onEscKeyDown);

        render(this._container, this._tripEventFormComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  getMode() {
    return this._mode;
  }

  setDefaultView() {
    switch (this._mode) {
      case Mode.EDIT:
        this._replaceFormToTripEvent();
        break;
      case Mode.ADDING:
        this.destroy();
        break;
    }
  }

  destroy() {
    remove(this._tripEventFormComponent);
    remove(this._tripEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTripEventToForm() {
    this._onViewChange();

    replace(this._tripEventFormComponent, this._tripEventComponent);
    this._mode = Mode.EDIT;

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToTripEvent() {
    replace(this._tripEventComponent, this._tripEventFormComponent);
    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(event) {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, null, null);
        this.destroy();

        return;
      }

      this._replaceFormToTripEvent();
    }
  }
}
