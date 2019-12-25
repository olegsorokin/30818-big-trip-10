import TripEventComponent from '../components/trip-event';
import TripEventFormComponent from '../components/trip-event-edit';
import {render, RenderPosition, replace} from '../utils/render';

export default class PointController {
  constructor(container) {
    this._container = container;

    this._tripEventComponent = null;
    this._tripEventFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent) {
    this._tripEvent = tripEvent;

    this._tripEventComponent = new TripEventComponent(this._tripEvent);
    this._tripEventFormComponent = new TripEventFormComponent(this._tripEvent);

    this._tripEventComponent.setClickHandler(() => {
      this._replaceTripEventToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventFormComponent.setSubmitHandler(() => {
      this._replaceFormToTripEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
  }

  _onEscKeyDown(event) {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      this._replaceFormToTripEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replaceTripEventToForm() {
    replace(this._tripEventFormComponent, this._tripEventComponent);
  }

  _replaceFormToTripEvent() {
    replace(this._tripEventComponent, this._tripEventFormComponent);
  }
}
