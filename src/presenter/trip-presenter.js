import { RenderPosition, remove, render } from '../framework/render';
import { getDurationMinutes } from '../utils/event';
import TripInfoView from '../view/trip-info-view';

export default class TripPresenter {
  #container = null;
  #eventsModel = null;
  #tripInfoComponent = null;
  #events = null;
  #offers = new Map();
  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#onModelEvent);
  }

  get cost() {
    return this.#events
      .map((event) => event.basePrice + this.#getOffersPrice(event.offers))
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  get getTripInfo() {
    const tripInfo = {
      destinationInfo: [],
      cost: this.cost,
    };

    if (!this.#events.length) {
      return tripInfo;
    }

    const destinationDummy = {
      date: null,
      cityName: '...',
    };

    const sortEvents = this.#events.sort((nextEvent, currentEvent) =>
      getDurationMinutes(currentEvent.dateFrom, nextEvent.dateFrom)
    );

    const getInfo = (date, destination) => ({
      date: date,
      cityName: this.#eventsModel.getCityById(destination)?.name,
    });

    const pushInfo = (index, dateField) => {
      const date = sortEvents[index][dateField];
      const destination = sortEvents[index].destination;
      tripInfo.destinationInfo.push(getInfo(date, destination));
    };

    pushInfo(0, 'dateFrom');

    if (sortEvents.length > 3) {
      tripInfo.destinationInfo.push(destinationDummy);
    }

    pushInfo(sortEvents.length - 1, 'dateTo');

    return tripInfo;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    [...this.#eventsModel.offers].map((type) => {
      type.offers.map(({ id, price }) => this.#offers.set(id, price));
    });
    this.#renderTripInfo();
  };

  #getOffersPrice = (offers) =>
    offers
      .map((offerId) => this.#offers.get(offerId))
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  #renderTripInfo = () => {
    if (!this.#events.length) {
      return;
    }
    const tripInfo = this.getTripInfo;
    this.#tripInfoComponent = new TripInfoView({ tripInfo });
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #onModelEvent = () => {
    remove(this.#tripInfoComponent);
    this.init();
  };
}
