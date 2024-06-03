import dayjs from 'dayjs';
import { DateFormat, EditFormMode } from '../const';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const getDateString = (date, format) =>
  date ? dayjs(date).format(format) : '';
const getHumanizeDate = (date) => getDateString(date, DateFormat.HUMANIZE);
const getMachinizeDate = (date) =>
  getDateString(date, DateFormat.MACHINIZE_DATE);
const getMachinizeDateTime = (date) =>
  getDateString(date, DateFormat.MACHINIZE_DATETIME);
const getShortTime = (date) => getDateString(date, DateFormat.SHORT_TIME);
const getInputDateTime = (date) =>
  getDateString(date, DateFormat.INPUT_DATETIME);

const getDurationMinutes = (dateFrom, dateTo) =>
  dayjs(dateTo).diff(dayjs(dateFrom), 'm');

const getDurationString = (dateFrom, dateTo) => {
  const duration = {
    minutes: 0,
    hours: 0,
    days: 0,
    getHumanizeString: function () {
      const strings = [];
      strings.push(`${String(this.minutes).padStart(2, '0')}M`);
      if (this.hours > 0 || this.days > 0) {
        strings.unshift(`${String(this.hours).padStart(2, '0')}H`);
      }

      if (this.days > 0) {
        strings.unshift(`${String(this.days).padStart(2, '0')}D`);
      }
      return strings.join(' ');
    },
  };

  duration.minutes = getDurationMinutes(dateFrom, dateTo);
  duration.hours = Math.floor(duration.minutes / MINUTES_IN_HOUR);
  duration.minutes = duration.minutes % MINUTES_IN_HOUR;
  duration.days = Math.floor(duration.hours / HOURS_IN_DAY);
  duration.hours = duration.hours % HOURS_IN_DAY;

  return duration.getHumanizeString();
};

const getPeriodString = (dateFrom, dateTo, delimiter) => {
  const periods = [];

  const dateFromFormat = DateFormat.HUMANIZE_FIRSTDAY;
  periods.push(getDateString(dateFrom, dateFromFormat));

  periods.push(getDateString(dateTo, DateFormat.HUMANIZE_FIRSTDAY));

  return periods.join(delimiter);
};

const getValueFromArrayById = (items, id) =>
  items.find((item) => item.id === id);

const isNewEvent = (event) => !Object.hasOwn(event, 'id');

const getFormMode = (event) =>
  isNewEvent(event) ? EditFormMode.NEW : EditFormMode.EDIT;

const isDigitString = (testString) => /^\d+$/i.test(testString);

const isNewEventPresenter = (presenter) =>
  presenter.editFormMode === EditFormMode.NEW;

export {
  getDurationMinutes,
  getDurationString,
  getFormMode,
  getHumanizeDate,
  getInputDateTime,
  getMachinizeDate,
  getMachinizeDateTime,
  getPeriodString,
  getShortTime,
  getValueFromArrayById,
  isDigitString,
  isNewEvent,
  isNewEventPresenter,
};
