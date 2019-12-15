import {formatShortDate} from '../utils/format-time';
import {createElement} from '../utils.js';

const createBoardTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class Board {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBoardTemplate();
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
