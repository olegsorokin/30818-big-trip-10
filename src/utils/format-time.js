import moment from 'moment';

export const getStartOfDate = (date) => {
  return moment(date).startOf(`day`).valueOf();
};

export const getDiffTime = (start, end) => {
  return moment(end).diff(moment(start));
};

export const formatTime = (timestamp) => {
  return moment(timestamp).format(`HH:mm`);
};

export const formatDatetime = (date) => {
  return moment(date).format(`YYYY-MM-DD HH:mm`);
};

export const formatDiff = (date) => {
  return moment(date).format(`DD[D] hh[H] mm[M]`);
};

export const formatShortDate = (date) => {
  return moment(date).format(`D MMM`);
};

export const isFutureDate = (date) => {
  return moment(date).isAfter(Date.now(), `day`);
};

export const isPastDate = (date) => {
  return moment(date).isBefore(Date.now(), `day`);
};
