import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const getFilterItemTemplate = (filterTypeName, checked) => {
  const filterTypeCode = filterTypeName.toLowerCase();
  return `<div class="trip-filters__filter">
  <input id="filter-${filterTypeCode}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterTypeCode}" ${checked}>
  <label class="trip-filters__filter-label" for="filter-${filterTypeCode}">${filterTypeName}</label>
</div>`;
};
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
