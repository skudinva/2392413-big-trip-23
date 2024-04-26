import { getCities } from '../mock/city';
import { getRandomEvent } from '../mock/event';
import { getOffers } from '../mock/offer';

const EVENT_COUNT = 3;

export default class EventsModel {
  events = Array.from({ length: EVENT_COUNT }, getRandomEvent);
  cities = getCities();
  offers = getOffers();
  getEvents() {
    return this.events;
  }

  getOffers() {
    return this.offers;
  }

  getOffersByType(type) {
    const offer = this.getOffers().find((offerItem) => offerItem.type === type);
    return offer.offers;
  }

  getSelectedOffers(type, eventOffers) {
    return this.getOffersByType(type).filter(
      (offer) => eventOffers.indexOf(offer.id) > -1
    );
  }

  getCities() {
    return this.cities;
  }

  getCityById(id) {
    return this.getCities().find((city) => city.id === id);
  }
}
