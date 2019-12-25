import BordComponent from '../components/board';
import DayComponent from '../components/day';
import NoEventsComponent from '../components/no-events';
import SortComponent, {SortType} from '../components/sort';
import {render, RenderPosition} from '../utils/render';
import PointController from './point';

const renderDays = (container, events) => {
  const getStartOfDate = (date) => {
    return new Date(date).setHours(0, 0, 0, 0);
  };
  const uniqueDates = new Set(events.map((tripEvent) => getStartOfDate(tripEvent.date.start)));

  [...uniqueDates].forEach((day, index) => {
    const dayComponent = new DayComponent(day, index);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const eventsInDay = events.filter((tripEvent) => getStartOfDate(tripEvent.date.start) === day);

    if (eventsInDay.length) {
      eventsInDay.forEach((tripEvent) => new PointController(dayEventsList).render(tripEvent));
    }

    render(container, dayComponent, RenderPosition.BEFOREEND);
  });
};

const renderSortedEvents = (container, events) => {
  const dayComponent = new DayComponent();
  const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);

  events.forEach((tripEvent) => new PointController(dayEventsList).render(tripEvent));

  render(container, dayComponent, RenderPosition.BEFOREEND);
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._bordComponent = new BordComponent();
  }

  render(events) {
    const container = this._container;

    if (!events.length) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._bordComponent, RenderPosition.BEFOREEND);
    renderDays(this._bordComponent.getElement(), events);

    this._sortComponent.setChangeHandler((sortType) => {
      this._bordComponent.getElement().innerHTML = ``;
      let sortedTripEvents = [];

      switch (sortType) {
        case SortType.EVENT:
          renderDays(this._bordComponent.getElement(), events);
          break;
        case SortType.TIME:
          sortedTripEvents = events.slice().sort((a, b) => (a.date.end - a.date.start) - (b.date.end - b.date.start));
          renderSortedEvents(this._bordComponent.getElement(), sortedTripEvents);
          break;
        case SortType.PRICE:
          sortedTripEvents = events.slice().sort((a, b) => a.price - b.price);
          renderSortedEvents(this._bordComponent.getElement(), sortedTripEvents);
          break;
      }
    });
  }
}
