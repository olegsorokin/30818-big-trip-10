import AbstractComponent from './abstract-component';
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

export default class Day extends AbstractComponent {
  constructor(day, dayIndex) {
    super();

    this._day = day;
    this._dayIndex = dayIndex;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._dayIndex);
  }
}
