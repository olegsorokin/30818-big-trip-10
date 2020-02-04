import TripInfoComponent from './components/trip-info';
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import Statistics from './components/statistics';
import TripController from './controllers/trip';
import FilterController from './controllers/filter';
import PointsModel from './models/points';
import {createTripEvents} from './mock/trip-event';
import {render, RenderPosition} from './utils/render';

const CARD_COUNT = 4;
const tripEvents = createTripEvents(CARD_COUNT)
  .sort((a, b) => a.date.start - b.date.start);
const pointsModel = new PointsModel();
pointsModel.setPoints(tripEvents);

const tripInfo = document.querySelector(`.trip-info`);
const totalCost = document.querySelector(`.trip-info__cost-value`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
const tripControls = document.querySelector(`.trip-controls`);
const menuTitle = document.querySelector(`.trip-controls .visually-hidden:first-child`);
const pageContainer = document.querySelector(`.page-main .page-body__container`);
const pageTripEvents = document.querySelector(`.trip-events`);

const calculateOffersPrice = (offers) => {
  return offers.reduce((acc, offer) => acc + offer.price, 0);
};

const totalCostValue = tripEvents.reduce((acc, tripEvent) => {
  return acc + tripEvent.price + calculateOffersPrice([...tripEvent.offers]);
}, 0);

totalCost.innerHTML = String(totalCostValue);

render(tripInfo, new TripInfoComponent(tripEvents), RenderPosition.AFTERBEGIN);

const siteMenuComponent = new SiteMenuComponent();
render(menuTitle, siteMenuComponent, RenderPosition.AFTEREND);

siteMenuComponent.setChangeHandler((menuItem) => {
  siteMenuComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      filterController.show();
      break;
    case MenuItem.STATISTICS:
      tripController.hide();
      statisticsComponent.show();
      filterController.hide();
      break;
  }
});

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripController = new TripController(pageTripEvents, pointsModel);
newEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});
tripController.render();

const statisticsComponent = new Statistics(pointsModel);
render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
