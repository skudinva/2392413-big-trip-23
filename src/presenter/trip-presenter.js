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
      cost: this.cost,
      destinations: [],
      dateFrom: null,
      dateTo: null,
    };

    if (!this.#events.length) {
      return tripInfo;
    }

    const sortEvents = this.#events.sort((nextEvent, currentEvent) =>
      getDurationMinutes(currentEvent.dateFrom, nextEvent.dateFrom)
    );

    sortEvents.map((event) => {
      const cityName = this.#eventsModel.getCityById(event.destination).name;

      if (!tripInfo.destinations.includes(cityName)) {
        tripInfo.destinations.push(cityName);
      }
    });

    tripInfo.dateFrom = sortEvents[0].dateFrom;
    tripInfo.dateTo = sortEvents[sortEvents.length - 1].dateTo;

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
