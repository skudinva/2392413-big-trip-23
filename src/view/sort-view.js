import { SORT_TEMPLATE_PROPS } from '../const';
import AbstractView from '../framework/view/abstract-view';

const createSortItemTemplate = (currentSortType, { type, label, disabled }) => {
  const additionProps =
    (type === currentSortType ? 'checked' : ' ') +
    (disabled ? 'disabled' : ' ');

  return `<div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${additionProps}>
    <label class="trip-sort__btn" for="sort-${type}">${label}</label>
    </div>`;
};

const createSortTemplate = (currentSortType) => {
  const sortItems = [];
  sortItems.push(
    '<form class="trip-events__trip-sort  trip-sort" action="#" method="get">'
  );

  SORT_TEMPLATE_PROPS.forEach((props) => {
    sortItems.push(createSortItemTemplate(currentSortType, props));
  });

  sortItems.push('</form>');
  return sortItems.join('');
};
export default class SortView extends AbstractView {
  #handleSortChange = null;
  #currentSortType = null;
  constructor({ onSortChange, currentSortType }) {
    super();

    if (!onSortChange) {
      throw new Error('Parameter "onSortChange" doesn\'t exist');
    }

    this.#handleSortChange = onSortChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#onSortChange);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #onSortChange = (evt) => {
    const sortType = evt.target.value.split('-')[1];
    this.#handleSortChange(sortType);
  };
}
