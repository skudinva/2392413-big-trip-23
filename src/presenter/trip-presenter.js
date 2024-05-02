import { RenderPosition, render } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripPresenter {
  #container = null;
  #eventsModel = null;
  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  #renderTripInfo() {
    const tripInfo = this.#eventsModel.getTripInfo;
    const tripInfoComponent = new TripInfoView({ tripInfo });
    render(tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  init() {
    this.#renderTripInfo();
  }
}
