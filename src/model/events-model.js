import { getRandomEvent } from '../mock/event';
import { getOffers } from '../mock/offer';

const EVENT_COUNT = 3;

export default class EventsModel {
  events = Array.from({ length: EVENT_COUNT }, getRandomEvent);
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
}
