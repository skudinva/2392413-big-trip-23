import { FilterType, UpdateType } from '../const';
import { render } from '../framework/render';
import { generateFilter } from '../utils/filter-events';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;
  #filtersModel = null;
  constructor({ container, eventsModel, filtersModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filtersModel = filtersModel;
  }

  get filters() {
    const events = this.#eventsModel.events;
    return generateFilter(events);
  }

  init = () => {
    const filters = this.filters;
    render(
      new FilterView({
        filters,
        onFilterButtonClick: this.#onFilterButtonClick,
      }),
      this.#container
    );
  };

  #onFilterButtonClick = (filterValue) => {
    const selectedFilterType = FilterType[filterValue.toUpperCase()];
    if (this.#filtersModel.currentFilterType === selectedFilterType) {
      return;
    }
    this.#filtersModel.setCurrentFilterType(
      UpdateType.MAJOR,
      selectedFilterType
    );
  };
}
