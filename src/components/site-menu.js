import {createElement} from '../utils';

const createMenuTemplate = (list) => {
  const menuItems = list.map((linkName) => {
    return (
      `<a class="trip-tabs__btn" href="#">${linkName}</a>`
    );
  }).join(`\n`);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">${menuItems}</nav>`
  );
};

export default class SiteMenu {
  constructor(menuItems) {
    this._menuItems = menuItems;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
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
