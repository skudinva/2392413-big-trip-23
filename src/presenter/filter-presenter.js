import { UpdateType } from '../const';
import { remove, render } from '../framework/render';
import { filterEvents } from '../utils/filter-events';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #filtersModel = null;
  #filterComponent = null;
  constructor({ container, filtersModel }) {
    this.#container = container;
    this.#filtersModel = filtersModel;
    this.#filtersModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    return Object.entries(filterEvents).map(([type]) => ({ type }));
  }

  init = () => {
    const filters = this.filters;
    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }
    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filtersModel.currentFilterType,
      onFilterButtonClick: this.#onFilterButtonClick,
    });
    render(this.#filterComponent, this.#container);
  };

  #onModelEvent = () => {
    this.init();
  };

  #onFilterButtonClick = (filterValue) => {
    if (this.#filtersModel.currentFilterType === filterValue) {
      return;
    }
    this.#filtersModel.setCurrentFilterType(UpdateType.MAJOR, filterValue);
  };
}
