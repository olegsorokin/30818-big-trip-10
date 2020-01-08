import moment from 'moment';

const getStartOfDate = (date) => {
  return moment(date).startOf(`day`).valueOf();
};

const getDiffTime = (start, end) => {
  return moment(end).diff(moment(start));
};

const formatTime = (timestamp) => {
  return moment(timestamp).format(`HH:mm`);
};

const formatDatetime = (date) => {
  return moment(date).format(`YYYY-MM-DD HH:mm`);
};

const formatDiff = (date) => {
  return moment(date).format(`DD[D] hh[H] mm[M]`);
};

const formatShortDate = (date) => {
  return moment(date).format(`D MMM`);
};

export {getStartOfDate, getDiffTime, formatTime, formatDiff, formatDatetime, formatShortDate};
