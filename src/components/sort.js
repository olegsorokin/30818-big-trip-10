import AbstractComponent from './abstract-component';
import {SortType} from '../const';

const SORT_PREFIX = `sort-`;

const getSortNameById = (id) => {
  return id.substring(SORT_PREFIX.length);
};

const createSortItemMarkup = (sortType, isChecked) => {
  const sortValue = SORT_PREFIX + sortType;

  return (
    `<div class="trip-sort__item  trip-sort__item--event">
      <input id="${sortValue}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortValue}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="${sortValue}">${sortType}</label>
    </div>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortItems = Object.values(SortType)
    .map((sortType) => createSortItemMarkup(sortType, currentSortType === sortType))
    .join(`\n`);

  return (
    `<form id="tripSort" class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      ${sortItems}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.EVENT;
  }

  getTemplate() {
    return createSortTemplate(this._currenSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (event) => {
      this._currenSortType = getSortNameById(event.target.value);

      handler(this._currenSortType);
    });
  }
}
