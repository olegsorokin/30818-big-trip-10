import AbstractComponent from './abstract-component';

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

export default class SiteMenu extends AbstractComponent {
  constructor(menuItems) {
    super();

    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }
}
