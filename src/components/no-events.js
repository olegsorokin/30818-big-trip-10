import {createElement} from '../utils.js';

const createNoEventsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoEvents {
  constructor() {
    this._elemtnt = null;
  }

  getTemplate() {
    return createNoEventsTemplate();
  }

  getElement() {
    if (!this._elemtnt) {
      this._elemtnt = createElement(this.getTemplate());
    }

    return this._elemtnt;
  }

  removeElement() {
    this._elemtnt = null;
  }
}
