import {createElement} from '../utils';

const createFiltersTemplate = (list) => {
  const filterList = list.map((filterName, index) => {
    const filter = filterName.toLowerCase();
    const checked = index === 0 ? `checked` : ``;

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${checked}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filterName}</label>
      </div>`
    );
  }).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter {
  constructor(tripEvents) {
    this._tripEvents = tripEvents;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._tripEvents);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
