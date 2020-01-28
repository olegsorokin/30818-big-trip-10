import BordComponent from '../components/board';
import DayComponent from '../components/day';
import NoEventsComponent from '../components/no-events';
import SortComponent from '../components/sort';
import {render, RenderPosition} from '../utils/render';
import {getStartOfDate} from '../utils/format-time';
import PointController, {Mode as PointControllerMode} from './point';
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
    pointController.render(tripEvent);
  });

  render(container, dayComponent, RenderPosition.BEFOREEND);

  return controllersList;
};


export default class TripController {
  constructor(container, tasksModel) {
    this._container = container;
    this._pointsModel = tasksModel;

    this._pointControllers = [];

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
    const points = this._pointsModel.getPoints();
    const container = this._container;

    if (!points.length) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._bordComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points);
  }

  _renderPoints(points) {
    const sortType = this._pointsModel.getSortType();

    if (sortType === SortType.EVENT) {
      this._pointControllers = renderDays(this._bordComponent.getElement(), points, this._onDataChange, this._onViewChange);
    } else {
      this._pointControllers = renderSortedEvents(this._bordComponent.getElement(), points, this._onDataChange, this._onViewChange);
    }
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._container.querySelectorAll(`.day`).forEach((day) => day.remove());
    this._noEventsComponent.getElement().remove();
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }

  _onDataChange(pointController, oldData, newData) {
    if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
    }

    const isSuccess = this._pointsModel.updatePoints(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData, PointControllerMode.DEFAULT);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._pointsModel.setSortType(sortType);
    this._removePoints();
    const points = this._pointsModel.getPoints();

    if (sortType === SortType.EVENT) {
      this._pointControllers = renderDays(this._bordComponent.getElement(), points, this._onDataChange, this._onViewChange);
    } else {
      this._pointControllers = renderSortedEvents(this._bordComponent.getElement(), points, this._onDataChange, this._onViewChange);
    }
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
