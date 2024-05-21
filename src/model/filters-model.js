import { DEFAULT_FILTER_TYPE } from '../const';
import Observable from '../framework/observable';

export default class FiltersModel extends Observable {
  #currentFilterType = DEFAULT_FILTER_TYPE;

  get currentFilterType() {
    return this.#currentFilterType;
  }

  setCurrentFilterType = (updateType, filterType) => {
    this.#currentFilterType = filterType;
    this._notify(updateType, filterType);
  };
}
