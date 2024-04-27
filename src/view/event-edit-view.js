import { TYPE_EVENTS } from '../const';
import { getInputDateTime } from '../utils';
import ComponentSimpleView from './component-simple-view';

const createEventTypeListTemplate = (type) => {
  const eventTypeListTemplate = [];
  eventTypeListTemplate.push(`<fieldset class="event__type-group">
  <legend class="visually-hidden">Event type</legend>`);

  TYPE_EVENTS.forEach((typeEvent) => {
    const typeEventCode = typeEvent.toLowerCase();
    const checkedProperty = typeEventCode === type ? 'checked' : '';
    eventTypeListTemplate.push(`<div class="event__type-item">
    <input id="event-type-${typeEventCode}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeEventCode}" ${checkedProperty}>
   <label class="event__type-label  event__type-label--${typeEventCode}" for="event-type-${typeEventCode}-1">${typeEvent}</label>
  </div>`);
  });

  eventTypeListTemplate.push('</fieldset>');
  return eventTypeListTemplate.join('');
};

const createEventTypeTemplate = ({ type }) => {
  const eventTypeTemplate = [];
  const eventTypeListTemplate = createEventTypeListTemplate(type);
  eventTypeTemplate.push(`<div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          ${eventTypeListTemplate}
        </div>
      </div>`);

  return eventTypeTemplate.join('');
};
const createDestinationTemplate = (cities, selectedCity) => {
  const elements = [];
  elements.push(`<div class="event__field-group  event__field-group--destination">
  <label class="event__label  event__type-output" for="event-destination-1">
    Flight
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectedCity.name}" list="destination-list-1">
  <datalist id="destination-list-1">`);
  cities.forEach((city) => {
    elements.push(`<option value="${city.name}"></option>`);
  });
  elements.push('</datalist></div>');
  return elements.join('');
};

const createEventDateTemplate = ({ dateFrom, dateTo }) => {
  const dateFromInput = getInputDateTime(dateFrom);
  const dateToInput = getInputDateTime(dateTo);
  return `<div class="event__field-group  event__field-group--time">
<label class="visually-hidden" for="event-start-time-1">From</label>
<input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromInput}">
&mdash;
<label class="visually-hidden" for="event-end-time-1">To</label>
<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToInput}">
</div>`;
};

const createPriceTemplate = ({
  basePrice,
}) => `<div class="event__field-group  event__field-group--price">
<label class="event__label" for="event-price-1">
  <span class="visually-hidden">Price</span>
  &euro;
</label>
<input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
</div>`;

const createOffersTemplate = (offers, selectedOffers) => {
  const offersTemplate = [];
  offersTemplate.push(`<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">`);
  offers.forEach((offer) => {
    const checkedState = selectedOffers.indexOf(offer.id) > -1 ? 'checked' : '';
    offersTemplate.push(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checkedState}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
      </div>`);
  });
  offersTemplate.push('</div></section>');
  return offersTemplate.join('');
};

const createDestinationDetailTemplate = ({ description, pictures }) => {
  const destDetalInfo = [];
  destDetalInfo.push(`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    <div class="event__photos-container"><div class="event__photos-tape">`);

  pictures.forEach((picture) => {
    destDetalInfo.push(
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    );
  });

  destDetalInfo.push('</div></div></section>');

  return destDetalInfo.join('');
};
export default class EventEditView extends ComponentSimpleView {
  constructor({ event, city, cities, offers }) {
    super();
    this.event = event;
    this.city = city;
    this.cities = cities;
    this.offers = offers;
  }

  createComponentTemplate() {
    const eventTypeTemplate = createEventTypeTemplate(this.event);
    const destinationTemplate = createDestinationTemplate(
      this.cities,
      this.city
    );
    const eventDateTemplate = createEventDateTemplate(this.event);
    const priceTemplate = createPriceTemplate(this.event);
    const offersTemplate = createOffersTemplate(this.offers, this.event.offers);
    const destinationDetailTemplate = createDestinationDetailTemplate(
      this.city
    );
    return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${eventTypeTemplate}
      ${destinationTemplate}
      ${eventDateTemplate}
      ${priceTemplate}
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${destinationDetailTemplate}
    </section>
  </form>`;
  }
}
