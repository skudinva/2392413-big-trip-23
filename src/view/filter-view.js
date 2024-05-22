import AbstractView from '../framework/view/abstract-view';

const getFilterItemTemplate = ({ type }, currentFilterType) => {
  const checked = type === currentFilterType ? 'checked' : '';
  return `<div class="trip-filters__filter">
  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checked}>
  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
</div>`;
};
export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterButtonClick = null;
  #currentFilterType = null;
  constructor({ filters, currentFilterType, onFilterButtonClick }) {
    super();
    if (!onFilterButtonClick) {
      throw new Error('Parameter "onFilterButtonClick" doesn\'t exist');
    }
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterButtonClick = onFilterButtonClick;
    this.element.addEventListener('change', this.#onFilterButtonClick);
  }

  get template() {
    const filterTemplate = this.#filters
      .map((filter) => getFilterItemTemplate(filter, this.#currentFilterType))
      .join('');
    return `<form class="trip-filters" action="#" method="get">
      ${filterTemplate}
    </form>`;
  }

  #onFilterButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleFilterButtonClick(evt.target.value);
  };
}
