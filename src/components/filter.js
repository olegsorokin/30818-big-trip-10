export const createFiltersTemplate = (list) => {
  const filterList = list.map((filterName) => {
    const filter = filterName.toLowerCase();

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" checked>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filterName}</label>
      </div>`
    );
  }).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
