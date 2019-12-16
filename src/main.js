import TripInfoComponent from './components/trip-info';
import SiteMenuComponent from './components/site-menu';
import FilterComponent from './components/filter';
import SortComponent from './components/sort';
import BordComponent from './components/board';
import DayComponent from './components/day';
import TripEventComponent from './components/trip-event';
import TripEventFormComponent from './components/trip-event-edit';
import {createTripEvents} from './mock/trip-event';
import {MENU_ITEMS} from './mock/site-menu';
import {FILTER} from './mock/filter';
import {render, RenderPosition} from './utils';

const CARD_COUNT = 4;
const tripEvents = createTripEvents(CARD_COUNT)
  .sort((a, b) => a.date.start - b.date.start);

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

render(tripInfo, new TripInfoComponent(tripEvents).getElement(), RenderPosition.AFTERBEGIN);
render(menuTitle, new SiteMenuComponent(MENU_ITEMS).getElement(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(FILTER).getElement(), RenderPosition.BEFOREEND);
render(pageTripEvents, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const renderEvent = (dayElement, tripEvent) => {
  const tripEventComponent = new TripEventComponent(tripEvent).getElement();
  const tripEventFormComponent = new TripEventFormComponent(tripEvent).getElement();

  const editButton = tripEventComponent.querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    dayElement.replaceChild(tripEventFormComponent, tripEventComponent);
  });

  tripEventFormComponent.addEventListener(`submit`, () => {
    dayElement.replaceChild(tripEventComponent, tripEventFormComponent);
  });

  render(dayElement, tripEventComponent, RenderPosition.BEFOREEND);
};

const renderDays = (place, events) => {
  const daysFragment = document.createDocumentFragment();
  const getStartOfDate = (date) => {
    return new Date(date).setHours(0, 0, 0, 0);
  };
  const uniqueDates = new Set(events.map((tripEvent) => getStartOfDate(tripEvent.date.start)));

  [...uniqueDates].forEach((day, index) => {
    const dayComponent = new DayComponent(day, index).getElement();
    const dayEventsList = dayComponent.querySelector(`.trip-events__list`);
    const eventsInDay = events.filter((tripEvent) => getStartOfDate(tripEvent.date.start) === day);

    if (eventsInDay.length) {
      eventsInDay.forEach((tripEvent) => renderEvent(dayEventsList, tripEvent));
    }

    render(daysFragment, dayComponent, RenderPosition.BEFOREEND);
  });

  render(place, daysFragment, RenderPosition.BEFOREEND);
};

const bordComponent = new BordComponent().getElement();
renderDays(bordComponent, tripEvents.slice(0, CARD_COUNT));
render(pageTripEvents, bordComponent, RenderPosition.BEFOREEND);
