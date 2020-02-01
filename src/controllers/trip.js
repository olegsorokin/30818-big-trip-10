import BordComponent from '../components/board';
import DayComponent from '../components/day';
import NoEventsComponent from '../components/no-events';
import SortComponent from '../components/sort';
import {render, RenderPosition, remove} from '../utils/render';
import {getStartOfDate} from '../utils/format-time';
import PointController, {EmptyEvent, Mode as PointControllerMode} from './point';
import {SortType} from '../const';

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
        pointController.render(tripEvent, PointControllerMode.DEFAULT);
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
    pointController.render(tripEvent, PointControllerMode.DEFAULT);
  });

  render(container, dayComponent, RenderPosition.BEFOREEND);

  return controllersList;
};


export default class Trip {
  constructor(container, tasksModel) {
    this._container = container;
    this._pointsModel = tasksModel;

    this._pointControllers = [];
    this._creatingEvent = null;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._bordComponent = new BordComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._bordComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points);
  }

  createEvent() {
    if (this._creatingEvent) {
      this._updatePoints();

      return;
    }

    this._pointControllers.forEach((point) => point.setDefaultView());

    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }

    this._creatingEvent = new PointController(this._bordComponent.getElement(), this._onDataChange, this._onViewChange, null);
    this._pointControllers.unshift(this._creatingEvent);

    this._creatingEvent.render(EmptyEvent, PointControllerMode.ADDING);
  }

  _renderPoints(points) {
    const sortType = this._pointsModel.getSortType();

    if (!points.length) {
      render(this._bordComponent.getElement(), this._noEventsComponent, RenderPosition.BEFOREEND);

      return;
    }

    if (sortType === SortType.EVENT) {
      this._pointControllers = renderDays(this._bordComponent.getElement(), points, this._onDataChange, this._onViewChange);
    } else {
      this._pointControllers = renderSortedEvents(this._bordComponent.getElement(), points, this._onDataChange, this._onViewChange);
    }
  }

  _removePoints() {
    // this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._creatingEvent = null;
    // this._container.querySelectorAll(`.day`).forEach((day) => day.remove());
    this._bordComponent.getElement().innerHTML = ``;
    // this._noEventsComponent.getElement().remove();
    remove(this._noEventsComponent);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }

  _onDataChange(pointController, oldData, newData) {
    this._creatingEvent = null;

    if (oldData === null) {
      if (newData === null) {
        return;
      }

      this._pointsModel.addPoint(newData);
      this._updatePoints();

      return;
    }

    if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();

      return;
    }

    const isSuccess = this._pointsModel.updatePoints(oldData.id, newData);

    if (isSuccess) {
      this._updatePoints();
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._pointsModel.setSortType(sortType);
    this._updatePoints();
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
