import BordComponent from '../components/board';
import DayComponent from '../components/day';
import NoEventsComponent from '../components/no-events';
import SortComponent from '../components/sort';
import TripEventComponent from '../components/trip-event';
import TripEventFormComponent from '../components/trip-event-edit';
import {render, replace, RenderPosition} from '../utils/render';

const renderEvent = (dayElement, tripEvent) => {
  const tripEventComponent = new TripEventComponent(tripEvent);
  const tripEventFormComponent = new TripEventFormComponent(tripEvent);
  const onEscKeyDown = (event) => {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      replaceFormToTripEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceTripEventToForm = () => {
    replace(tripEventFormComponent, tripEventComponent);
  };

  const replaceFormToTripEvent = () => {
    replace(tripEventComponent, tripEventFormComponent);
  };

  tripEventComponent.setClickHandler(() => {
    replaceTripEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  tripEventFormComponent.setSubmitHandler(() => {
    replaceFormToTripEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayElement, tripEventComponent, RenderPosition.BEFOREEND);
};

const renderDays = (container, events) => {
  const bordComponent = new BordComponent();
  const getStartOfDate = (date) => {
    return new Date(date).setHours(0, 0, 0, 0);
  };
  const uniqueDates = new Set(events.map((tripEvent) => getStartOfDate(tripEvent.date.start)));

  [...uniqueDates].forEach((day, index) => {
    const dayComponent = new DayComponent(day, index);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const eventsInDay = events.filter((tripEvent) => getStartOfDate(tripEvent.date.start) === day);

    if (eventsInDay.length) {
      eventsInDay.forEach((tripEvent) => renderEvent(dayEventsList, tripEvent));
    }

    render(bordComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
  });

  render(container, bordComponent, RenderPosition.BEFOREEND);
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
  }

  render(events) {
    const container = this._container;

    if (events.length) {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
      renderDays(container, events);
    } else {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
    }
  }
}
