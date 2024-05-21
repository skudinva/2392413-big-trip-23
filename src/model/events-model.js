import { EVENT_COUNT } from '../const';
import Observable from '../framework/observable';
import { getMockCities } from '../mock/city';
import { getRandomEvents } from '../mock/event';
import { getMockOffers } from '../mock/offer';
import { getValueFromArrayById } from '../utils/event';

export default class EventsModel extends Observable {
  #events = getRandomEvents(EVENT_COUNT);
  #cities = getMockCities();
  #offers = getMockOffers();
  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get cities() {
    return this.#cities;
  }

  getOffersByType(type) {
    const offer = this.offers.find((offerItem) => offerItem.type === type);
    return offer.offers;
  }

  getSelectedOffers(type, eventOffers) {
    return this.getOffersByType(type).filter((offer) =>
      eventOffers.includes(offer.id)
    );
  }

  getCityById(id) {
    return getValueFromArrayById(this.cities, id);
  }
}
