const EVENT_COUNT = 5;

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
  id: null,
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: null,
  offers: [],
  type: 'flight',
};

const DateFormat = {
  HUMANIZE: 'MMMM D',
  HUMANIZE_FIRSTDAY: 'D MMMM',
  DAYONLY: 'D',
  MACHINIZE_DATE: 'YYYY-MM-DD',
  MACHINIZE_DATETIME: 'YYYY-MM-DDTHH:mm',
  SHORT_TIME: 'HH:mm',
  INPUT_DATETIME: 'DD/MM/YY HH:mm',
  YEARMONTH: 'YYYY-MM',
};

const EditFormMode = { NEW: 'New', EDIT: 'Edit' };

const EventStateAction = {
  CREATE_NEW_FORM: 'Create new from',
  OPEN_EDIT_FORM: 'Open edit form',
  CLOSE_EDIT_FORM: 'Close edit from',
  SUBMIT_EDIT_FORM: 'Submit edit form',
  CANCEL_EDIT_FORM: 'Cancel edit form',
  DELETE_EDIT_FORM: 'Delete edit form',
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past',
};

const NoEventMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const DEFAULT_SORT_TYPE = SortType.DAY;

export {
  DEFAULT_EVENT_PROPS,
  DEFAULT_SORT_TYPE,
  DateFormat,
  EVENT_COUNT,
  EVENT_TYPES,
  EditFormMode,
  EventStateAction,
  FilterType,
  NoEventMessage,
  SortType,
};
