import FilterComponent from '../components/filter';
import {FilterType, HIDDEN_CLASS} from '../const';
import {render, RenderPosition} from '../utils/render';

export default class Filter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._activeFilterType = FilterType.EVERYTHING;

    // this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    // this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  show() {
    this._filterComponent.getElement().classList.remove(HIDDEN_CLASS);
  }

  hide() {
    this._filterComponent.getElement().classList.add(HIDDEN_CLASS);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType
      };
    });

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  // _onDataChange() {}
}
