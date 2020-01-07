import TripEventComponent from '../components/trip-event';
import TripEventFormComponent from '../components/trip-event-edit';
import {render, RenderPosition, replace} from '../utils/render';
import AbstractSmartComponent from '../components/abstract-smart-component';

export default class PointController extends AbstractSmartComponent {
  constructor(container, onDataChange) {
    super();

    this._container = container;
    this._onDataChange = onDataChange;

    this._tripEventComponent = null;
    this._tripEventFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventFormComponent = this._tripEventFormComponent;

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

  recoveryListeners() {}

  _replaceTripEventToForm() {
    replace(this._tripEventFormComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToTripEvent() {
    replace(this._tripEventComponent, this._tripEventFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(event) {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      this._replaceFormToTripEvent();
    }
  }
}
