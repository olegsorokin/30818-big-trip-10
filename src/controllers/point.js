import TripEventComponent from '../components/trip-event';
import TripEventFormComponent from '../components/trip-event-edit';
import {render, RenderPosition, replace} from '../utils/render';
import AbstractSmartComponent from '../components/abstract-smart-component';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
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

  render(tripEvent) {
    this._tripEventComponent = new TripEventComponent(tripEvent);
    this._tripEventFormComponent = new TripEventFormComponent(tripEvent);

    this._tripEventComponent.setRollupButtonClickHandler(() => {
      this._replaceTripEventToForm();
    });

    this._tripEventFormComponent.setRollupButtonClickHandler(() => {
      this._replaceFormToTripEvent();
    });

    this._tripEventFormComponent.setSubmitHandler(() => {
      this._replaceFormToTripEvent();
    });

    this._tripEventFormComponent.setFavoriteChangeHandler((evt) => {
      this._onDataChange(this, tripEvent, Object.assign({}, tripEvent, {
        isFavorite: evt.target.value
      }));
    });

    render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToTripEvent();
    }
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
      this._replaceFormToTripEvent();
    }
  }
}
