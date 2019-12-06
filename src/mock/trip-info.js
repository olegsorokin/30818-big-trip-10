const getTripInfo = (tripEvents) => {
  const cities = tripEvents.map((tripEvent) => tripEvent.city);
  const startDate = tripEvents[0].date.start;
  const endDate = tripEvents[tripEvents.length - 1].date.end;

  return {
    cities,
    date: {
      start: startDate,
      end: endDate
    }
  };
};

export {getTripInfo};
