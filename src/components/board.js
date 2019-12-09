import {formatShortDate} from '../utils/format-time';
import {createTripEventTemplate} from '../components/trip-event';

const getDaysMarkup = (tripEvents) => {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const getDate = (date) => {
    return date - date % ONE_DAY;
  };
  const uniqueDates = new Set(tripEvents.map((tripEvent) => getDate(tripEvent.date.start)));

  const getEventsByDate = (events, date) => {
    const sortedEvents = events.filter((tripEvent) => getDate(tripEvent.date.start) === date);

    return sortedEvents.map((tripEvent) => {
      return createTripEventTemplate(tripEvent);
    }).join(`\n`);
  };

  return [...uniqueDates].map((day, index) => {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${index + 1}</span>
          <time class="day__date" datetime="2019-03-18">${formatShortDate(day)}</time>
        </div>

        <ul class="trip-events__list">${getEventsByDate(tripEvents, day)}</ul>
      </li>`
    );
  }).join(`\n`);
};

const createBoardTemplate = (tripEvents) => {
  return (
    `<ul class="trip-days">
      ${getDaysMarkup(tripEvents)}
    </ul>`
  );
};

export {createBoardTemplate};
