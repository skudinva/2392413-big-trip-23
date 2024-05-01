import { EVENT_COUNT } from '../const';
import { getMockCities } from '../mock/city';
import { getRandomEvent } from '../mock/event';
import { getMockOffers } from '../mock/offer';

export default class EventsModel {
  events = Array.from({ length: EVENT_COUNT }, getRandomEvent);
  cities = getMockCities();
  offers = getMockOffers();
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
    return this.getOffersByType(type).filter((offer) =>
      eventOffers.includes(offer.id)
    );
  }

  getCities() {
    return this.cities;
  }

  getCityById(id) {
    return this.getCities().find((city) => city.id === id);
  }
}
