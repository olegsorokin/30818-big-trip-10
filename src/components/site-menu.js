import AbstractComponent from './abstract-component';

const ACTIVE_CLASS = `trip-tabs__btn--active`;
const TAG_NAME = `A`;

export const MenuItem = {
  TABLE: `Table`,
  STATISTICS: `Stats`
};


const createMenuTemplate = (currentPage) => {
  const menuItems = Object.values(MenuItem).map((item) => {
    return (
      `<a class="trip-tabs__btn ${currentPage === item ? ACTIVE_CLASS : ``}" href="#">${item}</a>`
    );
  }).join(`\n`);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">${menuItems}</nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();

    this._activePage = MenuItem.TABLE;
  }

  getTemplate() {
    return createMenuTemplate(this._activePage);
  }

  setActiveItem(menuItem) {
    const itemsMenuElements = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    itemsMenuElements.forEach((point) => {
      if (point.classList.contains(ACTIVE_CLASS)) {
        point.classList.remove(ACTIVE_CLASS);
      }

      if (point.text === menuItem) {
        point.classList.add(ACTIVE_CLASS);
      }
    });
  }

  setChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== TAG_NAME) {
        return;
      }
      const menuItem = evt.target.text;

      handler(menuItem);
    });
  }
}
