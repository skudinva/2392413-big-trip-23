import dayjs from 'dayjs';
import { DateFormat } from './const';

const getRandomArrayElement = (items) =>
  items[Math.floor(Math.random() * items.length)];
const guid = () =>
  '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );

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

const getDurationString = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }
  const date1 = dayjs(dateTo);
  const date2 = dayjs(dateFrom);
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

  duration.minutes = date1.diff(date2, 'm');
  duration.hours = Math.floor(duration.minutes / 60);
  duration.minutes = duration.minutes % 60;
  duration.days = Math.floor(duration.hours / 24);
  duration.hours = duration.hours % 24;

  return duration.getHumanizeString();
};

const getPeriodString = (dateFrom, dateTo, delimiter) => {
  const period = [];
  const dateFromFormat =
    getDateString(dateFrom, DateFormat.YEARMONTH) ===
    getDateString(dateTo, DateFormat.YEARMONTH)
      ? DateFormat.DAYONLY
      : DateFormat.HUMANIZE_FIRSTDAY;
  period.push(getDateString(dateFrom, dateFromFormat));
  period.push(getDateString(dateTo, DateFormat.HUMANIZE_FIRSTDAY));

  return period.join(delimiter);
};

const isFunction = (chechFunction) =>
  chechFunction && chechFunction instanceof Function;

export {
  getDurationString,
  getHumanizeDate,
  getInputDateTime,
  getMachinizeDate,
  getMachinizeDateTime,
  getPeriodString,
  getRandomArrayElement,
  getShortTime,
  guid,
  isFunction,
};
