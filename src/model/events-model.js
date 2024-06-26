import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { getValueFromArrayById } from '../utils/event';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #cities = [];
  #offers = [];
  #error = null;

  constructor({ eventsApiService }) {
    super();
    this.#eventsApiService = eventsApiService;
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

  init = async () => {
    this.#error = null;
    try {
      this.#cities = await this.#eventsApiService.cities;
      this.#offers = await this.#eventsApiService.offers;
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptEventToClient);
    } catch (error) {
      this.#error = error;
      this.#cities = [];
      this.#offers = [];
      this.#events = [];
    }
    this._notify(this.#error ? UpdateType.ERROR : UpdateType.INIT);
  };

  updateEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting event');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptEventToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can not update event');
    }
  };

  addEvent = async (updateType, update) => {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptEventToClient(response);
      this.#events = [newEvent, ...this.#events];
      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can not add event');
    }
  };

  deleteEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can not delete unexisting event');
    }

    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (error) {
      throw new Error('Can not delete event');
    }
  };

  getOffersByType = (type) => {
    const offer = this.offers.find((offerItem) => offerItem.type === type);
    return offer.offers;
  };

  getSelectedOffers = (type, eventOffers) =>
    this.getOffersByType(type).filter((offer) =>
      eventOffers.includes(offer.id)
    );

  getCityById = (id) => getValueFromArrayById(this.cities || [], id);

  #adaptEventToClient = (event) => {
    const adaptedEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];
    return adaptedEvent;
  };
}
