import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import he from 'he';
import { DateFormat, EVENT_TYPES } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {
  getInputDateTime,
  getValueFromArrayById,
  isDigitString,
  isNewEvent,
} from '../utils/event';

const createEventTypeListTemplate = ({ type }) => {
  const eventTypeListTemplates = [];
  eventTypeListTemplates.push(`<fieldset class="event__type-group">
  <legend class="visually-hidden">Event type</legend>`);

  EVENT_TYPES.forEach((typeEvent) => {
    const typeEventCode = typeEvent.toLowerCase();
    const checkedProperty = typeEventCode === type ? 'checked' : '';
    eventTypeListTemplates.push(`<div class="event__type-item">
    <input id="event-type-${typeEventCode}"
    class="event__type-input  visually-hidden" type="radio" name="event-type"
    value="${typeEventCode}" ${checkedProperty}>
   <label class="event__type-label  event__type-label--${typeEventCode}"
   for="event-type-${typeEventCode}">${typeEvent}</label>
  </div>`);
  });

  eventTypeListTemplates.push('</fieldset>');
  return eventTypeListTemplates.join('');
};

const createEventTypeTemplate = ({ type } = {}) => {
  const eventTypeTemplates = [];
  const eventTypeListTemplate = createEventTypeListTemplate({
    type,
  });
  eventTypeTemplates.push(`<div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17"
          src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle" type="checkbox">
        <div class="event__type-list">
          ${eventTypeListTemplate}
        </div>
      </div>`);

  return eventTypeTemplates.join('');
};
const createDestinationTemplate = ({ type, destination, cities }) => {
  const elements = [];
  const selectedCityName =
    getValueFromArrayById(cities, destination)?.name || '';
  elements.push(`<div class="event__field-group  event__field-group--destination">
  <label class="event__label  event__type-output"
  for="event-destination">${type}</label>
  <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination"
  value="${he.encode(selectedCityName)}" list="destination-list">
  <datalist id="destination-list">`);
  cities.forEach((city) => {
    elements.push(`<option value="${he.encode(city.name)}"></option>`);
  });
  elements.push('</datalist></div>');
  return elements.join('');
};

const createEventDateTemplate = ({ dateFrom, dateTo } = {}) => {
  const dateFromInput = getInputDateTime(dateFrom);
  const dateToInput = getInputDateTime(dateTo);
  return `<div class="event__field-group  event__field-group--time">
  <label class="visually-hidden" for="event-start-time">From</label>
  <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time"
  value="${he.encode(dateFromInput)}">
  &mdash;
  <label class="visually-hidden" for="event-end-time">To</label>
  <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time"
  value="${he.encode(dateToInput)}">
  </div>`;
};

const createPriceTemplate = ({ basePrice } = { basePrice: 0 }) =>
  `<div class="event__field-group  event__field-group--price">
  <label class="event__label" for="event-price">
    <span class="visually-hidden">Price</span>
    &euro;
  </label>
  <input class="event__input  event__input--price" id="event-price" type="text"
  name="event-price"
  value="${he.encode(String(basePrice))}"></div>`;
const createOffersTemplate = ({ type, offersList, offers: selectedOffers }) => {
  const offersByType = offersList.find(
    (offerItem) => offerItem.type === type
  ).offers;

  if (!offersByType || !offersByType.length) {
    return '';
  }

  const offerTemplates = [];
  offerTemplates.push(`<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">`);
  offersByType.forEach((offer) => {
    const checkedState = selectedOffers.includes(offer.id) ? 'checked' : '';
    offerTemplates.push(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.id}" type="checkbox"
      name="event-offer-${offer.id}"
      data-offer-id="${offer.id}" ${checkedState}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
      </div>`);
  });
  offerTemplates.push('</div></section>');
  return offerTemplates.join('');
};

const createDestinationDetailTemplate = ({ cities, destination } = {}) => {
  if (!destination || !cities.length) {
    return '';
  }

  const { description, pictures } = getValueFromArrayById(cities, destination);

  if (!description && !pictures.length) {
    return '';
  }
  const destinationTemplates = [];
  destinationTemplates.push(`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>`);

  if (pictures.length) {
    destinationTemplates.push(
      '<div class="event__photos-container"><div class="event__photos-tape">'
    );

    pictures.forEach((picture) => {
      destinationTemplates.push(
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
      );
    });

    destinationTemplates.push('</div></div></section>');
  }
  destinationTemplates.push('</section>');

  return destinationTemplates.join('');
};

const createEventEditTemplate = (eventState) => {
  const eventTypeTemplate = createEventTypeTemplate(eventState);
  const destinationTemplate = createDestinationTemplate(eventState);
  const eventDateTemplate = createEventDateTemplate(eventState);
  const priceTemplate = createPriceTemplate(eventState);
  const offerTemplate = createOffersTemplate(eventState);
  const destinationDetailTemplate = createDestinationDetailTemplate(eventState);
  const { isSaving, isDeleting } = eventState;
  const resetButtonCaption = () => {
    if (isNewEvent(eventState)) {
      return 'Cancel';
    }
    return isDeleting ? 'Deleting...' : 'Delete';
  };

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${eventTypeTemplate}
      ${destinationTemplate}
      ${eventDateTemplate}
      ${priceTemplate}
      <button class="event__save-btn btn btn--blue"
      type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn"
      type="reset">${resetButtonCaption()}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offerTemplate}
      ${destinationDetailTemplate}
    </section>
  </form>`;
};
export default class EventEditView extends AbstractStatefulView {
  /**@type {Array} */
  #cities = null;
  #offersList = null;
  #handleFormSubmit = null;
  #handleFormReset = null;
  #handleDeleteClick = null;
  #datepickers = new Map();

  constructor({
    event,
    cities,
    offersList,
    onFormSubmit,
    onCancelClick,
    onDeleteClick,
  }) {
    super();
    if (!onFormSubmit) {
      throw new Error('Parameter "onFormSubmit" doesn\'t exist');
    }

    if (!onCancelClick) {
      throw new Error('Parameter "onCancelClick" doesn\'t exist');
    }

    if (!onDeleteClick) {
      throw new Error('Parameter "onDeleteClick" doesn\'t exist');
    }

    this._setState(EventEditView.parseEventToState(event));

    this.#cities = cities;
    this.#offersList = offersList;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onCancelClick;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate({
      ...this._state,
      cities: this.#cities,
      offersList: this.#offersList,
    });
  }

  removeElement = () => {
    super.removeElement();
    this.#datepickers.forEach((picker) => {
      picker.destroy();
    });
    this.#datepickers.clear();
  };

  _restoreHandlers = () => {
    this.element.addEventListener('submit', this.#onFormSubmit);
    this.element.addEventListener('reset', this.#onFormReset);

    if (!isNewEvent(this._state)) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#onDeleteClick);
    }

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onFormReset);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#onEventTypeChange);

    const destinationElement = this.element.querySelector(
      '.event__input--destination'
    );
    destinationElement.addEventListener('input', this.#onEventDestinationInput);
    destinationElement.addEventListener(
      'keypress',
      this.#onEventDestinationKeypress
    );

    const basePriceElement = this.element.querySelector('.event__input--price');
    basePriceElement.addEventListener('input', this.#onEventBasePriceInput);
    basePriceElement.addEventListener(
      'keypress',
      this.#onEventBasePriceKeypress
    );
    const offersContainerElement = this.element.querySelector(
      '.event__available-offers'
    );
    if (offersContainerElement) {
      offersContainerElement.addEventListener(
        'change',
        this.#onEventOffersChange
      );
    }

    this.#setDatepicker();
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    const event = EventEditView.parseStateToEvent(this._state);
    this.#handleFormSubmit(event);
  };

  #onFormReset = () => {
    this.#handleFormReset();
  };

  #onDeleteClick = (evt) => {
    evt.preventDefault();
    const event = EventEditView.parseStateToEvent(this._state);
    this.#handleDeleteClick(event);
  };

  #onEventTypeChange = (evt) => {
    this.updateElement({ type: evt.target.value, offers: [] });
  };

  #onEventDestinationInput = (evt) => {
    const selectedCity = this.#cities.find(
      (city) => city.name === evt.target.value
    );
    if (!selectedCity) {
      return;
    }

    this.updateElement({
      destination: selectedCity?.id,
    });
  };

  #onEventDestinationKeypress = (evt) => {
    const inputDestination = evt.target.value.concat(evt.key).toLowerCase();
    const isMatchDestination = this.#cities.some((city) =>
      city.name.toLowerCase().includes(inputDestination)
    );

    if (!isMatchDestination) {
      evt.preventDefault();
    }
  };

  #onDateFromChange = ([userDate]) => {
    this._setState({ dateFrom: userDate });
    this.#datepickers.get('dateTo').config.minDate = this._state.dateFrom;
  };

  #onDateToChange = ([userDate]) => {
    this._setState({ dateTo: userDate });
  };

  #onEventBasePriceInput = (evt) => {
    this._setState({ basePrice: parseInt(evt.target.value, 10) });
  };

  #onEventBasePriceKeypress = (evt) => {
    if (!isDigitString(evt.key)) {
      evt.preventDefault();
    }
  };

  #onEventOffersChange = (evt) => {
    const currentOffersState = new Set(this._state.offers);
    const {
      dataset: { offerId },
      checked,
    } = evt.target;

    if (checked) {
      currentOffersState.add(offerId);
    } else {
      currentOffersState.delete(offerId);
    }

    this._setState({ offers: Array.from(currentOffersState) });
  };

  #setDatepicker = () => {
    const datepickerFields = [
      {
        name: 'dateFrom',
        fieldId: '#event-start-time',
        defaultDate: this._state.dateFrom,
        callback: this.#onDateFromChange,
      },
      {
        name: 'dateTo',
        fieldId: '#event-end-time',
        defaultDate: this._state.dateTo,
        callback: this.#onDateToChange,
        minDate: this._state.dateFrom,
      },
    ];

    datepickerFields.forEach((dateField) => {
      const dateElement = this.element.querySelector(dateField.fieldId);
      const newFlatpickr = flatpickr(dateElement, {
        enableTime: true,
        dateFormat: DateFormat.DATEPICKER,
        defaultDate: dateField.defaultDate,
        onChange: dateField.callback,
        ['time_24hr']: true,
        minDate: dateField.minDate,
      });

      this.#datepickers.set(dateField.name, newFlatpickr);
    });
  };

  static parseEventToState = (event) => ({
    ...event,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToEvent = (eventState) => {
    const newEventState = { ...eventState };
    delete newEventState.isSaving;
    delete newEventState.isDeleting;
    return newEventState;
  };
}
