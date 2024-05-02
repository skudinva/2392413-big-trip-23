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

    tripInfo.cost = this.events
      .map((event) => event.basePrice)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    const sortEvents = [...this.events].sort(
      (nextEvent, currentEvent) =>
        new Date(nextEvent.dateFrom) - new Date(currentEvent.dateFrom)
    );

    tripInfo.destinationInfo.push({
      date: sortEvents[0].dateFrom,
      cityName: this.getCityById(sortEvents[0].destination).name,
    });

    if (sortEvents.length > 3) {
      tripInfo.destinationInfo.push({
        date: null,
        cityName: '...',
      });
    } else if (sortEvents.length === 3) {
      tripInfo.destinationInfo.push({
        date: sortEvents[1].dateFrom,
        cityName: this.getCityById(sortEvents[1].destination).name,
      });
    }

    if (sortEvents.length > 1) {
      tripInfo.destinationInfo.push({
        date: sortEvents[sortEvents.length - 1].dateTo,
        cityName: this.getCityById(
          sortEvents[sortEvents.length - 1].destination
        ).name,
      });
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
