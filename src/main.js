import TripInfoComponent from './components/trip-info';
import SiteMenuComponent from './components/site-menu';
import TripController from './controllers/trip';
import FilterController from './controllers/filter';
import PointsModel from './models/points';
import {createTripEvents} from './mock/trip-event';
import {MENU_ITEMS} from './mock/site-menu';
import {render, RenderPosition} from './utils/render';

const CARD_COUNT = 4;
const tripEvents = createTripEvents(CARD_COUNT)
  .sort((a, b) => a.date.start - b.date.start);
const pointsModel = new PointsModel();
pointsModel.setPoints(tripEvents);

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

render(tripInfo, new TripInfoComponent(tripEvents), RenderPosition.AFTERBEGIN);
render(menuTitle, new SiteMenuComponent(MENU_ITEMS), RenderPosition.AFTEREND);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripController = new TripController(pageTripEvents, pointsModel);
tripController.render();
