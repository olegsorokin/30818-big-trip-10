import {createInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/site-menu';
import {createFiltersTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createFormTripEventTemplate} from './components/trip-event-edit';
import {createBoardTemplate} from './components/board';
import {createTripEvents} from './mock/trip-event';
import {MENU_ITEMS} from './mock/site-menu';
import {FILTER} from './mock/filter';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const CARD_COUNT = 4;
const tripEvents = createTripEvents(CARD_COUNT)
  .sort((a, b) => a.date.start - b.date.start);
console.log(tripEvents);

const tripInfo = document.querySelector(`.trip-info`);
const totalCost = document.querySelector(`.trip-info__cost-value`);
const tripControls = document.querySelector(`.trip-controls`);
const menuTitle = document.querySelector(`.trip-controls .visually-hidden:first-child`);
const pageTripEvents = document.querySelector(`.trip-events`);

const calculateOffersPrice = (offers) => {
  return offers.reduce((acc, offer) => acc + offer.price, 0);
};

const totalCostValue = tripEvents.reduce((acc, tripEvent) => {
  return acc + tripEvent.price + calculateOffersPrice([...tripEvent.offers]);
}, 0);

totalCost.innerHTML = String(totalCostValue);

render(tripInfo, createInfoTemplate(tripEvents), `afterbegin`);
render(menuTitle, createMenuTemplate(MENU_ITEMS), `afterend`);
render(tripControls, createFiltersTemplate(FILTER), `beforeend`);
render(pageTripEvents, createSortTemplate(), `beforeend`);
render(pageTripEvents, createFormTripEventTemplate(tripEvents[0], 1), `beforeend`);
render(pageTripEvents, createBoardTemplate(tripEvents.slice(1, CARD_COUNT)), `beforeend`);
