import dayjs from 'dayjs';
import { DateFormat, EditFormMode } from '../const';

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
  duration.hours = Math.floor(duration.minutes / 60);
  duration.minutes = duration.minutes % 60;
  duration.days = Math.floor(duration.hours / 24);
  duration.hours = duration.hours % 24;

  return duration.getHumanizeString();
};

const getPeriodString = (dateFrom, dateTo, delimiter) => {
  const period = [];

  const dateFromFormat = DateFormat.HUMANIZE_FIRSTDAY;
  period.push(getDateString(dateFrom, dateFromFormat));

  period.push(getDateString(dateTo, DateFormat.HUMANIZE_FIRSTDAY));

  return period.join(delimiter);
};

const getValueFromArrayById = (array, id) =>
  array.find((item) => item.id === id);

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
