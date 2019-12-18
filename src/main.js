import TripInfoComponent from './components/trip-info';
import SiteMenuComponent from './components/site-menu';
import FilterComponent from './components/filter';
import SortComponent from './components/sort';
import BordComponent from './components/board';
import DayComponent from './components/day';
import TripEventComponent from './components/trip-event';
import TripEventFormComponent from './components/trip-event-edit';
import NoEventsComponent from './components/no-events';
import {createTripEvents} from './mock/trip-event';
import {MENU_ITEMS} from './mock/site-menu';
import {FILTER} from './mock/filter';
import {render, replace, RenderPosition} from './utils/render';

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

render(tripInfo, new TripInfoComponent(tripEvents), RenderPosition.AFTERBEGIN);
render(menuTitle, new SiteMenuComponent(MENU_ITEMS), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(FILTER), RenderPosition.BEFOREEND);
render(pageTripEvents, new SortComponent(), RenderPosition.BEFOREEND);

const renderEvent = (dayElement, tripEvent) => {
  const tripEventComponent = new TripEventComponent(tripEvent);
  const tripEventFormComponent = new TripEventFormComponent(tripEvent);
  const onEscKeyDown = (event) => {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      replaceFormToTripEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceTripEventToForm = () => {
    replace(tripEventFormComponent, tripEventComponent);
  };

  const replaceFormToTripEvent = () => {
    replace(tripEventComponent, tripEventFormComponent);
  };

  tripEventComponent.setClickHandler(() => {
    replaceTripEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  tripEventFormComponent.setSubmitHandler(() => {
    replaceFormToTripEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayElement, tripEventComponent, RenderPosition.BEFOREEND);
};

const renderDays = (events) => {
  const bordComponent = new BordComponent();
  const getStartOfDate = (date) => {
    return new Date(date).setHours(0, 0, 0, 0);
  };
  const uniqueDates = new Set(events.map((tripEvent) => getStartOfDate(tripEvent.date.start)));

  [...uniqueDates].forEach((day, index) => {
    const dayComponent = new DayComponent(day, index);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const eventsInDay = events.filter((tripEvent) => getStartOfDate(tripEvent.date.start) === day);

    if (eventsInDay.length) {
      eventsInDay.forEach((tripEvent) => renderEvent(dayEventsList, tripEvent));
    }

    render(bordComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
  });

  render(pageTripEvents, bordComponent, RenderPosition.BEFOREEND);
};

if (CARD_COUNT) {
  renderDays(tripEvents.slice(0, CARD_COUNT));
} else {
  render(pageTripEvents, new NoEventsComponent().getElement(), RenderPosition.BEFOREEND);
}
