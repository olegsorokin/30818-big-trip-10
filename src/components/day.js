import {createElement} from '../utils';
import {formatShortDate} from '../utils/format-time';

const createDayTemplate = (day, index) => {
  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${index + 1}</span>
          <time class="day__date" datetime="2019-03-18">${formatShortDate(day)}</time>
        </div>

        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class Day {
  constructor(day, dayIndex) {
    this._day = day;
    this._dayIndex = dayIndex;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._dayIndex);
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
