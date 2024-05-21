import { sortTemplateProps } from '../const';
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

  sortTemplateProps.forEach((props) => {
    sortItems.push(createSortItemTemplate(currentSortType, props));
  });

  sortItems.push('</form>');
  return sortItems.join('');
};
export default class SortView extends AbstractView {
  #handleSortButtonClick = null;
  #currentSortType = null;
  constructor({ onSortButtonClick, currentSortType }) {
    super();

    if (!onSortButtonClick) {
      throw new Error('Parameter "onSortButtonClick" doesn\'t exist');
    }

    this.#handleSortButtonClick = onSortButtonClick;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#onSortButtonClick);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #onSortButtonClick = (evt) => {
    const sortType = evt.target.value.split('-')[1];
    this.#handleSortButtonClick(sortType);
  };
}
