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
const getDurationString = (dateFrom, dateTo) => {
  const date1 = dayjs(dateTo);
  const date2 = dayjs(dateFrom);
  const duration = {
    minutes: 0,
    hours: 0,
    days: 0,
    strings: [],
  };

  duration.minutes = date1.diff(date2, 'm');
  if (duration.minutes >= 60) {
    duration.hours = Math.floor(duration.minutes / 60);
    duration.minutes -= duration.hours * 60;
  }
  if (duration.hours >= 24) {
    duration.days = Math.floor(duration.hours / 24);
    duration.hours -= duration.days * 24;
  }
  duration.strings.push(`${String(duration.days).padStart(2, '0')}D`);
  duration.strings.push(`${String(duration.hours).padStart(2, '0')}H`);
  duration.strings.push(`${String(duration.minutes).padStart(2, '0')}M`);
  duration.strings.every(
    (element, index) => {
      if (element.startsWith('00')) {
        delete duration.strings[index];
        return true;
      }
      return false;
    });
  return duration.strings.join(' ');
};

export {
  getDurationString,
  getHumanizeDate,
  getMachinizeDate,
  getMachinizeDateTime,
  getRandomArrayElement,
  getShortTime,
  guid
};

