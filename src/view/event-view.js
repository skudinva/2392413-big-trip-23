import AbstractView from '../framework/view/abstract-view';
import {
  getDurationString,
  getHumanizeDate,
  getMachinizeDate,
  getMachinizeDateTime,
  getShortTime,
} from '../utils/event';

const createFavoriteButtonTemplate = (isFavoriteFlag) => {
  const favoriteClassName = isFavoriteFlag ? 'event__favorite-btn--active' : '';
  return `<button class="event__favorite-btn ${favoriteClassName}" type="button">
  <span class="visually-hidden">Add to favorite</span>
  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
  <path
    d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
  </svg></button>`;
};

const createOfferTemplate = (selectedOffers) => {
  if (!selectedOffers.length) {
    return '';
  }
  const offersElement = ['<ul class="event__selected-offers">'];
  selectedOffers.forEach((offer) => {
    offersElement.push(`<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`);
  });

  offersElement.push('</ul>');
  return offersElement.join('');
};
export default class EventView extends AbstractView {
  #event = null;
  #city = null;
  /**@type {Array} */
  #selectedOffers = null;
  #handleEditClick = null;
  #handleFavoriteButtonClick = null;

  constructor({
    event,
    city,
    selectedOffers,
    onEditButtonClick,
    onFavoriteButtonClick,
  }) {
    super();

    if (!onEditButtonClick) {
      throw new Error('Parameter "onEditButtonClick" doesn\'t exist');
    }

    if (!onFavoriteButtonClick) {
      throw new Error('Parameter "onFavoriteButtonClick" doesn\'t exist');
    }

    this.#event = event;
    this.#city = city;
    this.#selectedOffers = selectedOffers;
    this.#handleEditClick = onEditButtonClick;
    this.#handleFavoriteButtonClick = onFavoriteButtonClick;

    this.element
      .querySelector('button.event__rollup-btn')
      .addEventListener('click', this.#onEditButtonClick);

    this.element
      .querySelector('button.event__favorite-btn')
      .addEventListener('click', this.#onFavoriteButtonClick);
  }

  get template() {
    const { basePrice, isFavorite, type, dateFrom, dateTo } = this.#event;
    const { name: cityName } = this.#city || {};

    const machinizeDate = getMachinizeDate(dateFrom);
    const humanizeDate = getHumanizeDate(dateFrom);
    const machinizeDateTimeFrom = getMachinizeDateTime(dateFrom);
    const machinizeDateTimeTo = getMachinizeDateTime(dateTo);
    const shortTimeFrom = getShortTime(dateFrom);
    const shortTimeTo = getShortTime(dateTo);
    const eventDuration = getDurationString(dateFrom, dateTo);
    const offerTemplate = createOfferTemplate(this.#selectedOffers);
    const favoriteButtonTemplate = createFavoriteButtonTemplate(isFavorite);

    return `<li class="trip-events__item"><div class="event">
        <time class="event__date" datetime="${machinizeDate}">${humanizeDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon" />
        </div>
        <h3 class="event__title">${type} ${cityName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${machinizeDateTimeFrom}">${shortTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${machinizeDateTimeTo}">${shortTimeTo}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offerTemplate}
        ${favoriteButtonTemplate}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div></li>`;
  }

  #onEditButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #onFavoriteButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteButtonClick();
  };
}
