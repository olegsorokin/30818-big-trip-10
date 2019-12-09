const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString(`en-GB`, {hour: `numeric`, minute: `numeric`});
};

const formatDatetime = (date) => {
  return new Date(date).toISOString().slice(0, -5);
};

const getDiffTime = (start, end) => {
  return new Date(Math.abs(end - start));
};

const formatDiff = (date) => {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const days = Math.floor(date.getTime() / ONE_DAY);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formatData = (value, suffix, isVisible) => {
    return isVisible ? (`0` + value).slice(-2) + suffix : ``;
  };

  return [
    formatData(days, `D`, Boolean(days)),
    formatData(hours, `H`, Boolean(days || hours)),
    formatData(minutes, `M`, Boolean(days || hours || minutes))
  ].join(` `);
};

const formatInputDate = (date) => {
  const options = {
    hour: `2-digit`,
    minute: `2-digit`
  };
  const targetDate = new Date(date);

  return `${targetDate.toLocaleDateString(`en-GB`)} ${targetDate.toLocaleTimeString(`en-GB`, options)}`;
};

export {formatTime, getDiffTime, formatDiff, formatDatetime, formatInputDate};
