import { EVENT_COUNT } from '../const';
import Observable from '../framework/observable';
import { getMockCities } from '../mock/city';
import { getRandomEvents } from '../mock/event';
import { getMockOffers } from '../mock/offer';
import { getValueFromArrayById } from '../utils/event';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = getRandomEvents(EVENT_COUNT);
  #cities = getMockCities();
  #offers = getMockOffers();

  constructor({ eventsApiService }) {
    super();
    this.#eventsApiService = eventsApiService;
    this.#eventsApiService.events.then((events) => {
      console.log(events);
    });
  }

  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get cities() {
    return this.#cities;
  }

  updateEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addEvent = (updateType, update) => {
    this.#events = [update, ...this.#events];

    this._notify(updateType, update);
  };

  deleteEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can not delete unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  };

  getOffersByType = (type) => {
    const offer = this.offers.find((offerItem) => offerItem.type === type);
    return offer.offers;
  };

  getSelectedOffers = (type, eventOffers) =>
    this.getOffersByType(type).filter((offer) =>
      eventOffers.includes(offer.id)
    );

  getCityById = (id) => getValueFromArrayById(this.cities, id);
}
