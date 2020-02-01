import {getPointsByFilter} from '../utils/filters';
import {FilterType, SortType} from '../const';

export default class PointsModel {
  constructor() {
    this._points = [];

    this._activeFilterType = FilterType.EVERYTHING;
    this._activeSortType = SortType.EVENT;

    this._filterChangeHandlers = [];
    this._sortChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getPoints() {
    const sortPoints = this._sortPoints(this._points, this._activeSortType);
    return getPointsByFilter(sortPoints, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  getSortType() {
    return this._activeSortType;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
    this._callHandlers(this._sortChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setSortChangeHandler(handler) {
    this._sortChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  removePoint(id) {
    const index = this._points.findIndex((point) => point.id === id);

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
  }

  updatePoints(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    return true;
  }

  _sortPoints(points, sortType) {
    this._activeSortType = sortType;
    let sortedPoints = [];

    switch (this._activeSortType) {
      case SortType.EVENT:
        sortedPoints = points.slice();
        break;
      case SortType.TIME:
        sortedPoints = points.slice().sort((a, b) => (a.date.end - a.date.start) - (b.date.end - b.date.start));
        break;
      case SortType.PRICE:
        sortedPoints = points.slice().sort((a, b) => a.price - b.price);
        break;
    }

    return sortedPoints;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
