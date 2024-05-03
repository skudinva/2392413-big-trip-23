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

export {
  DEFAULT_EVENT_PROPS,
  DateFormat,
  EVENT_COUNT,
  EVENT_TYPES,
  EditFormMode,
};
