import { getCities } from '../mock/city';
import { getRandomEvent } from '../mock/event';
import { getOffers } from '../mock/offer';

const EVENT_COUNT = 3;

export default class EventsModel {
  events = Array.from({ length: EVENT_COUNT }, getRandomEvent);
  cities = getCities();
  getEvents() {
    return this.events;
  }

  getOffers() {
    return getOffers();
  }

  getOffersByType(type) {
    const offer = this.getOffers().find((offerItem) => offerItem.type === type);
    return offer.offers;
  }

  getCities() {
    return this.cities;
  }

  getCityById(id) {
    return this.getCities().find((city) => city.id === id);
  }
}
