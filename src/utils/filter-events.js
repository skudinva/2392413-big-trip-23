import dayjs from 'dayjs';
import { FilterType } from '../const';

const filterEvents = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) =>
    events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom))),
  [FilterType.PAST]: (events) =>
    events.filter((event) => dayjs().isAfter(dayjs(event.dateFrom))),
  [FilterType.PRESENT]: (events) =>
    events.filter(
      (event) =>
        dayjs().isAfter(dayjs(event.dateFrom)) &&
        dayjs().isBefore(dayjs(event.dateTo))
    ),
};

function generateFilter(events) {
  return Object.entries(filterEvents).map(([filterType, applyFilter]) => ({
    type: filterType,
    count: applyFilter(events).length,
  }));
}

export { filterEvents, generateFilter };
