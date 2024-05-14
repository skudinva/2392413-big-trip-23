import { RenderPosition, render } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripPresenter {
  #container = null;
  #eventsModel = null;
  #events = null;
  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  get cost() {
    return this.#events
      .map((event) => event.basePrice)
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

    const sortEvents = this.#events.sort(
      (nextEvent, currentEvent) =>
        new Date(nextEvent.dateFrom) - new Date(currentEvent.dateFrom)
    );

    const getInfo = (date, destination) => ({
      date: date,
      cityName: this.#eventsModel.getCityById(destination).name,
    });

    const pushInfo = (index, dateField) => {
      const date = sortEvents[index][dateField];
      const destination = sortEvents[index].destination;
      tripInfo.destinationInfo.push(getInfo(date, destination));
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

  init = () => {
    this.#events = [...this.#eventsModel.events];
    this.#renderTripInfo();
  };

  #renderTripInfo = () => {
    if (!this.#events.length) {
      return;
    }
    const tripInfo = this.getTripInfo;
    const tripInfoComponent = new TripInfoView({ tripInfo });
    render(tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  };
}
