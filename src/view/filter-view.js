import AbstractView from '../framework/view/abstract-view';

const getFilterItemTemplate = ({ type, count }, currentFilterType) => {
  const checked = type === currentFilterType ? 'checked' : '';
  const disabled = !count ? 'disabled' : '';
  return `<div class="trip-filters__filter">
  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checked} ${disabled}>
  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
</div>`;
};
export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterChange = null;
  #currentFilterType = null;
  constructor({ filters, currentFilterType, onFilterChange }) {
    super();
    if (!onFilterChange) {
      throw new Error('Parameter "onFilterChange" doesn\'t exist');
    }
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    const filterTemplate = this.#filters
      .map((filter) => getFilterItemTemplate(filter, this.#currentFilterType))
      .join('');
    return `<form class="trip-filters" action="#" method="get">
      ${filterTemplate}
    </form>`;
  }

  #onFilterChange = (evt) => {
    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };
}
