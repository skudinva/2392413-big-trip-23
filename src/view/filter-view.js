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
  #filters;
  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    const filterTemplate = this.#filters
      .map((filter, index) => getFilterItemTemplate(filter, !index))
      .join('');
    return `<form class="trip-filters" action="#" method="get">
      ${filterTemplate}
    </form>`;
  }
}
