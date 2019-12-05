import {createInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/site-manu';
import {createFiltersTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createFormCardCreateTemplate} from './components/card-create';
import {createFormCardEditTemplate} from './components/card-edit';
import {createBoardTemplate} from './components/board';
import {createCardTemplate} from './components/card';
import {createTripEvents} from './mock/trip-event';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const CARD_COUNT = 3;
const tripEvents = createTripEvents(CARD_COUNT);

const tripInfo = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls`);
const menuTitle = document.querySelector(`.trip-controls .visually-hidden:first-child`);
const pageTripEvents = document.querySelector(`.trip-events`);

render(tripInfo, createInfoTemplate(), `afterbegin`);
render(menuTitle, createMenuTemplate(), `afterend`);
render(tripControls, createFiltersTemplate(), `beforeend`);
render(pageTripEvents, createSortTemplate(), `beforeend`);
render(pageTripEvents, createFormCardCreateTemplate(), `beforeend`);
render(pageTripEvents, createFormCardEditTemplate(), `beforeend`);
render(pageTripEvents, createBoardTemplate(), `beforeend`);

const cards = document.querySelector(`.trip-events__list`);

tripEvents.forEach((tripEvent) => render(cards, createCardTemplate(tripEvent), `beforeend`));
