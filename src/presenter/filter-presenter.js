import { UpdateType } from '../const';
import { remove, render } from '../framework/render';
import { filterEvents } from '../utils/filter-events';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #filtersModel = null;
  #eventsModel = null;
  #filterComponent = null;
  #events = null;
  constructor({ container, filtersModel, eventsModel }) {
    this.#container = container;
    this.#filtersModel = filtersModel;
    this.#eventsModel = eventsModel;
    this.#filtersModel.addObserver(this.#onModelEvent);
    this.#eventsModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    return Object.entries(filterEvents).map(([filterType, applyFilter]) => ({
      type: filterType,
      count: applyFilter(this.#events).length,
    }));
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];

    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filtersModel.currentFilterType,
      onFilterChange: this.#onFilterChange,
    });
    render(this.#filterComponent, this.#container);
  };

  #onModelEvent = () => {
    this.init();
  };

  #onFilterChange = (filterType) => {
    if (this.#filtersModel.currentFilterType === filterType) {
      return;
    }
    this.#filtersModel.setCurrentFilterType(UpdateType.MAJOR, filterType);
  };
}
