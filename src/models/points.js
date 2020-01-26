import {getPointsByFilter} from '../utils/filters';
import {FilterType, SortType} from '../const';

export default class PointsModel {
  constructor() {
    this._points = [];
    this._modifiedPoints = [];

    this._activeFilterType = FilterType.EVERYTHING;
    this._activeSortType = SortType.EVENT;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    this._modifiedPoints = this._sortPoints(this._modifiedPoints, this._activeSortType);
    return getPointsByFilter(this._modifiedPoints, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  getSortType() {
    return this._activeSortType;
  }

  setPoints(points) {
    this._points = Array.from(points);
    this._modifiedPoints = Array.from(points);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
  }

  updatePoints(id, point) {
    const index = this._modifiedPoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._modifiedPoints = [].concat(this._modifiedPoints.slice(0, index), point, this._modifiedPoints.slice(index + 1));

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
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
