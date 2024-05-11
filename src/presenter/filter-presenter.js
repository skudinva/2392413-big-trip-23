import { render } from '../framework/render';
import { generateFilter } from '../utils/filter-events';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;
  #events = null;
  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    const filters = generateFilter(this.#events);
    render(new FilterView({ filters }), this.#container);
  };
}
