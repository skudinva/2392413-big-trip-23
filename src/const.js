const EVENT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const DEFAULT_EVENT_PROPS = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight',
};

const DateFormat = {
  HUMANIZE: 'MMM D',
  HUMANIZE_FIRSTDAY: 'D MMM',
  DAYONLY: 'D',
  MACHINIZE_DATE: 'YYYY-MM-DD',
  MACHINIZE_DATETIME: 'YYYY-MM-DDTHH:mm',
  SHORT_TIME: 'HH:mm',
  INPUT_DATETIME: 'DD/MM/YY HH:mm',
  YEARMONTH: 'YYYY-MM',
  DATEPICKER: 'd/m/y H:i',
};

const EditFormMode = { NEW: 'New', EDIT: 'Edit', VIEW: 'View' };

const EventStateAction = {
  OPEN_EDIT_FORM: 'Open edit form',
  CLOSE_EDIT_FORM: 'Close edit from',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past',
};

const noEventMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  [UpdateType.ERROR]: 'Failed to load latest route information',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const SORT_TEMPLATE_PROPS = [
  { type: SortType.DAY, label: 'Day', disabled: false },
  { type: 'event', label: 'Event', disabled: true },
  { type: SortType.TIME, label: 'Time', disabled: false },
  { type: SortType.PRICE, label: 'Price', disabled: false },
  { type: 'offer', label: 'Offers', disabled: true },
];

const DEFAULT_SORT_TYPE = SortType.DAY;
const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;

const ApiConfig = {
  AUTHORIZATION: `Basic ${btoa('user:pass12')}`,
  END_POINT: 'https://23.objects.htmlacademy.pro/big-trip',
  EVENTS_URL: 'points',
  DESTINATIONS_URL: 'destinations',
  OFFERS_URL: 'offers',
};

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000,
};

const MAX_LIMIT_TRIP_ROUTE = 3;

export {
  ApiConfig,
  DEFAULT_EVENT_PROPS,
  DEFAULT_FILTER_TYPE,
  DEFAULT_SORT_TYPE,
  DateFormat,
  EVENT_TYPES,
  EditFormMode,
  EventStateAction,
  FilterType,
  MAX_LIMIT_TRIP_ROUTE,
  SORT_TEMPLATE_PROPS,
  SortType,
  TimeLimit,
  UpdateType,
  UserAction,
  noEventMessage,
};
