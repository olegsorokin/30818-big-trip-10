import BordComponent from '../components/board';
import DayComponent from '../components/day';
import NoEventsComponent from '../components/no-events';
import SortComponent, {SortType} from '../components/sort';
import {render, RenderPosition} from '../utils/render';
import {getStartOfDate} from '../utils/format-time';
import PointController from './point';

const renderDays = (container, events, onDataChange, onViewChange) => {
  const controllersList = [];
  const uniqueDates = new Set(events.map((tripEvent) => getStartOfDate(tripEvent.date.start)));

  [...uniqueDates].forEach((day, index) => {
    const dayComponent = new DayComponent(day, index);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const eventsInDay = events.filter((tripEvent) => getStartOfDate(tripEvent.date.start) === day);

    if (eventsInDay.length) {
      eventsInDay.forEach((tripEvent) => {
        const pointController = new PointController(dayEventsList, onDataChange, onViewChange);
        controllersList.push(pointController);
        pointController.render(tripEvent);
      });
    }

    render(container, dayComponent, RenderPosition.BEFOREEND);
  });

  return controllersList;
};

const renderSortedEvents = (container, events, onDataChange, onViewChange) => {
  const controllersList = [];
  const dayComponent = new DayComponent();
  const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);

  events.forEach((tripEvent) => {
    const pointController = new PointController(dayEventsList, onDataChange, onViewChange);
    controllersList.push(pointController);
    pointController.render(tripEvent);
  });

  render(container, dayComponent, RenderPosition.BEFOREEND);

  return controllersList;
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._pointControllers = [];

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._bordComponent = new BordComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events) {
    this._events = events;
    const container = this._container;

    if (!events.length) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._bordComponent, RenderPosition.BEFOREEND);
    this._pointControllers = renderDays(this._bordComponent.getElement(), this._events, this._onDataChange, this._onViewChange);

    this._sortComponent.setChangeHandler((sortType) => {
      this._bordComponent.getElement().innerHTML = ``;
      let sortedTripEvents = [];

      switch (sortType) {
        case SortType.EVENT:
          this._pointControllers = renderDays(this._bordComponent.getElement(), this._events, this._onDataChange, this._onViewChange);
          break;
        case SortType.TIME:
          sortedTripEvents = this._events.slice().sort((a, b) => (a.date.end - a.date.start) - (b.date.end - b.date.start));
          this._pointControllers = renderSortedEvents(this._bordComponent.getElement(), sortedTripEvents, this._onDataChange, this._onViewChange);
          break;
        case SortType.PRICE:
          sortedTripEvents = this._events.slice().sort((a, b) => a.price - b.price);
          this._pointControllers = renderSortedEvents(this._bordComponent.getElement(), sortedTripEvents, this._onDataChange, this._onViewChange);
          break;
      }
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
}
