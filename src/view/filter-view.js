import AbstractView from '../framework/view/abstract-view';

const getFilterItemTemplate = ({ type }, isChecked) => {
  const typeCode = type.toLowerCase();
  const checked = isChecked ? 'checked' : '';
  return `<div class="trip-filters__filter">
  <input id="filter-${typeCode}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${typeCode}" ${checked}>
  <label class="trip-filters__filter-label" for="filter-${typeCode}">${type}</label>
</div>`;
};
export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterButtonClick = null;
  constructor({ filters, onFilterButtonClick }) {
    super();
    if (!onFilterButtonClick) {
      throw new Error('Parameter "onFilterButtonClick" doesn\'t exist');
    }
    this.#filters = filters;
    this.#handleFilterButtonClick = onFilterButtonClick;
    this.element.addEventListener('change', this.#onFilterButtonClick);
  }

  get template() {
    const filterTemplate = this.#filters
      .map((filter, index) => getFilterItemTemplate(filter, !index))
      .join('');
    return `<form class="trip-filters" action="#" method="get">
      ${filterTemplate}
    </form>`;
  }

  #onFilterButtonClick = (evt) => {
    this.#handleFilterButtonClick(evt.target.value);
  };
}
