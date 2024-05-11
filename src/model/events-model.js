import { EVENT_COUNT } from '../const';
import { getMockCities } from '../mock/city';
import { getRandomEvent } from '../mock/event';
import { getMockOffers } from '../mock/offer';

export default class EventsModel {
  #events = getRandomEvent(EVENT_COUNT);
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
    return this.cities.find((city) => city.id === id);
  }
}
