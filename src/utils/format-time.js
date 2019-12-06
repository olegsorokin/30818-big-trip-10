const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString(`ru`, {hour: `numeric`, minute: `numeric`});
};

const getDiffTime = (start, end) => {
  return new Date(Math.abs(end - start));
};

const formatDiff = (date) => {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const days = Math.floor(date.getTime() / ONE_DAY);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formatData = (value, suffix, isVisible) => isVisible ? (`0` + value).slice(-2) + suffix : ``;

  return [
    formatData(days, `D`, Boolean(days)),
    formatData(hours, `H`, Boolean(days || hours)),
    formatData(minutes, `M`, Boolean(days || hours || minutes))
  ].join(` `);
};

export {formatTime, getDiffTime, formatDiff};
