import { DEFAULT_FILTER_TYPE, FilterType } from '../const';
import { render } from '../framework/render';
import { filterEvents, generateFilter } from '../utils/filter-events';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;
  #events = null;
  #currentFilterType = DEFAULT_FILTER_TYPE;
  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    const filters = generateFilter(this.#events);
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
    if (this.#currentFilterType === selectedFilterType) {
      return;
    }

    filterEvents[selectedFilterType](this.#events); //пока смысла в этом нет
  };
}
