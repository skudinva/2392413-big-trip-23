import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const getFilterItemTemplate = (
  filterType,
  checked
) => `<div class="trip-filters__filter">
  <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${checked}>
  <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
</div>`;
export default class FilterView extends AbstractView {
  get template() {
    const filterTemplate = [];
    filterTemplate.push('<form class="trip-filters" action="#" method="get">');
    for (const key in FilterType) {
      const filterItem = getFilterItemTemplate(FilterType[key], '');
      filterTemplate.push(filterItem);
    }
    filterTemplate.push('</form>');
    return filterTemplate.join('');
  }
}
