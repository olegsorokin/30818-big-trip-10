import moment from 'moment';

export const getStartOfDate = (date) => {
  return moment(date).startOf(`day`).valueOf();
};

export const formatTime = (timestamp) => {
  return moment(timestamp).format(`HH:mm`);
};

export const formatDatetime = (date) => {
  return moment(date).format(`YYYY-MM-DD HH:mm`);
};

export const formatDiff = (start, end) => {
  const diff = moment(end).diff(moment(start));
  const minutes = moment.duration(diff).minutes();
  const hours = moment.duration(diff).hours();
  const days = moment.duration(diff).days();

  if (days === 0) {
    if (hours === 0) {
      return moment(`${minutes}`, `m`).format(`mm[M]`);
    }

    return moment(`${hours} ${minutes}`, `H m`).format(`HH[H] mm[M]`);
  }

  return moment(`${days} ${hours} ${minutes}`, `D H m`).format(`DD[D] HH[H] mm[M]`);
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

export const parseTime = (time, mask) => {
  return moment(time, mask).unix() * 1000;
};
