import {createInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/site-menu';
import {createFiltersTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createFormCardCreateTemplate} from './components/card-create';
import {createFormCardEditTemplate} from './components/card-edit';
import {createBoardTemplate} from './components/board';
import {createTripEventTemplate} from './components/trip-event';
import {createTripEvents} from './mock/trip-event';
import {MENU_ITEMS} from './mock/site-menu';
import {FILTER} from './mock/filter';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const CARD_COUNT = 3;
const tripEvents = createTripEvents(CARD_COUNT)
  .sort((a, b) => a[`date.start`] - b[`data.end`]);

const tripInfo = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls`);
const menuTitle = document.querySelector(`.trip-controls .visually-hidden:first-child`);
const pageTripEvents = document.querySelector(`.trip-events`);

render(tripInfo, createInfoTemplate(tripEvents), `afterbegin`);
render(menuTitle, createMenuTemplate(MENU_ITEMS), `afterend`);
render(tripControls, createFiltersTemplate(FILTER), `beforeend`);
render(pageTripEvents, createSortTemplate(), `beforeend`);
render(pageTripEvents, createFormCardCreateTemplate(), `beforeend`);
render(pageTripEvents, createFormCardEditTemplate(), `beforeend`);
render(pageTripEvents, createBoardTemplate(), `beforeend`);

const cards = document.querySelector(`.trip-events__list`);

tripEvents.forEach((tripEvent) => render(cards, createTripEventTemplate(tripEvent), `beforeend`));
