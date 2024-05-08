import { FilterType } from './const';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => event),
  [FilterType.PAST]: (events) => events.filter((event) => event),
  [FilterType.PRESENT]: (events) => events.filter((event) => event),
};

function generateFilter(events) {
  return Object.entries(filter).map(([filterType, filterEvents]) => ({
    type: filterType,
    count: filterEvents(events).length,
  }));
}

export { filter, generateFilter };
