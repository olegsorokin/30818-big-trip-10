import FilterComponent from '../components/filter';
import {FilterType} from '../const';
import {render, RenderPosition} from '../utils/render';

export default class Filter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType
      };
    });

    const filterComponent = new FilterComponent(filters);
    filterComponent.setFilterChangeHandler(this._onFilterChange);

    render(this._container, filterComponent, RenderPosition.BEFOREEND);
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
