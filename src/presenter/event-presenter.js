import { render } from '../framework/render';
import EventItemView from '../view/event-item-view';
import EventsListView from '../view/events-list-view';
import SortView from '../view/sort-view';
import EventEngine from './event-engine';

export default class EventPresenter {
  #sortComponent = new SortView();
  #eventListComponent = new EventsListView();
  #container = null;
  #eventsModel = null;
  #events = null;
  #cities = null;
  #currentEventEditForm = null;

  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  #renderEventItem(callback) {
    const itemComponent = new EventItemView();
    render(itemComponent, this.#eventListComponent.element);
    callback(itemComponent);
  }

  #eventEditStateChange = (event) => {
    const oldEditState = event.editState;
    if (!oldEditState && this.#currentEventEditForm) {
      this.#currentEventEditForm.resetEditForm();
    }
    this.#currentEventEditForm = !oldEditState ? event : null;
    return true;
  };

  #renderTripPoint(event) {
    this.#renderEventItem((container) => {
      new EventEngine({
        event,
        eventsModel: this.#eventsModel,
        cities: this.#cities,
        container,
        editStateChange: this.#eventEditStateChange,
      });
    });
  }

  #renderTripPoints() {
    for (let i = 0; i < this.#events.length; i++) {
      this.#renderTripPoint(this.#events[i]);
    }
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#cities = [...this.#eventsModel.cities];
    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);
    this.#renderTripPoints();
  }
}

/*
пусть полежит в подвале
  #renderEventNew() {
    this.#renderEventEdit(DEFAULT_EVENT_PROPS);
  }

  #renderEventEdit(event) {
    this.#renderEventItem((container) => {
      const city = this.#eventsModel.getCityById(event.destination);
      const offers = this.#eventsModel.getOffersByType(event.type);
      render(
        new EventEditView({
          event: event,
          city: city,
          cities: this.#cities,
          offers: offers,
        }),
        container.element
      );
    });
  }*/
