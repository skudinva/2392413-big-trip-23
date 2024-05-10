import { NoEventMessage } from '../const';
import AbstractView from '../framework/view/abstract-view';

export default class NoEventsView extends AbstractView {
  #currentFilter = null;
  constructor({ currentFilter }) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    const message = NoEventMessage[this.#currentFilter];
    return `<p class="trip-events__msg">${message}</p>`;
  }
}
