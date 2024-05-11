import { SortType } from '../const';
import { getDurationMinutes } from './event';

const sortEvents = {
  [SortType.DAY]: (events) =>
    events.sort(
      (nextEvent, currentEvent) =>
        new Date(currentEvent.dateFrom) - new Date(nextEvent.dateFrom)
    ),
  [SortType.PRICE]: (events) =>
    events.sort(
      (nextEvent, currentEvent) => currentEvent.basePrice - nextEvent.basePrice
    ),
  [SortType.TIME]: (events) =>
    events.sort(
      (nextEvent, currentEvent) =>
        getDurationMinutes(currentEvent.dateFrom, currentEvent.dateTo) -
        getDurationMinutes(nextEvent.dateFrom, nextEvent.dateTo)
    ),
};

export { sortEvents };
