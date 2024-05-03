import { EVENT_COUNT } from '../const';
import { getMockCities } from '../mock/city';
import { getRandomEvent } from '../mock/event';
import { getMockOffers } from '../mock/offer';

export default class EventsModel {
  #events = Array.from({ length: EVENT_COUNT }, getRandomEvent);
  #cities = getMockCities();
  #offers = getMockOffers();
  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get getTripInfo() {
    const tripInfo = {
      destinationInfo: [],
      cost: 0,
    };

    const destinationDummy = {
      date: null,
      cityName: '...',
    };

    tripInfo.cost = this.events
      .map((event) => event.basePrice)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    const sortEvents = [...this.events].sort(
      (nextEvent, currentEvent) =>
        new Date(nextEvent.dateFrom) - new Date(currentEvent.dateFrom)
    );

    const getInfo = (date, destination) => ({
      date: date,
      cityName: this.getCityById(destination).name,
    });

    const pushInfo = (index, dateField) => {
      tripInfo.destinationInfo.push(
        getInfo(sortEvents[index][dateField], sortEvents[index].destination)
      );
    };

    pushInfo(0, 'dateFrom');

    if (sortEvents.length > 3) {
      tripInfo.destinationInfo.push(destinationDummy);
    } else if (sortEvents.length === 3) {
      pushInfo(1, 'dateFrom');
    }

    if (sortEvents.length > 1) {
      pushInfo(sortEvents.length - 1, 'dateTo');
    }

    return tripInfo;
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

  get cities() {
    return this.#cities;
  }

  getCityById(id) {
    return this.cities.find((city) => city.id === id);
  }
}
