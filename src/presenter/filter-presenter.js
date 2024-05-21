import { FilterType, UpdateType } from '../const';
import { render } from '../framework/render';
import { filterEvents } from '../utils/filter-events';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #filtersModel = null;
  constructor({ container, filtersModel }) {
    this.#container = container;
    this.#filtersModel = filtersModel;
  }

  get filters() {
    return Object.entries(filterEvents).map(([type]) => ({ type }));
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
