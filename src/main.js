import {createInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/site-manu';
import {createFiltersTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createFormCardCreateTemplate} from './components/card-create';
import {createFormCardEditTemplate} from './components/card-edit';
import {createBoardTemplate} from './components/board';
import {createCardTemplate} from './components/card';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const CARD_COUNT = 3;

const tripInfo = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls`);
const menuTitle = document.querySelector(`.trip-controls .visually-hidden:first-child`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripInfo, createInfoTemplate(), `afterbegin`);
render(menuTitle, createMenuTemplate(), `afterend`);
render(tripControls, createFiltersTemplate(), `beforeend`);
render(tripEvents, createSortTemplate(), `beforeend`);
render(tripEvents, createFormCardCreateTemplate(), `beforeend`);
render(tripEvents, createFormCardEditTemplate(), `beforeend`);
render(tripEvents, createBoardTemplate(), `beforeend`);

const cards = document.querySelector(`.trip-events__list`);

new Array(CARD_COUNT).fill(``).forEach(() => render(cards, createCardTemplate(), `beforeend`));
