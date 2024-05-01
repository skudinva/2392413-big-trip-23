import { DEFAULT_EVENT_PROPS } from '../const';
import { render } from '../render';
import EventEditView from '../view/event-edit-view';
import EventItemView from '../view/event-item-view';
import EventView from '../view/event-view';
import EventsListView from '../view/events-list-view';
import SortView from '../view/sort-view';

export default class EventPresenter {
  sortComponent = new SortView();
  eventListComponent = new EventsListView();

  constructor({ container, eventsModel }) {
    this.container = container;
    this.eventsModel = eventsModel;
  }

  renderEventItem(callback) {
    const itemComponent = new EventItemView();
    render(itemComponent, this.eventListComponent.getElement());
    callback(itemComponent);
  }

  renderEventNew() {
    this.renderEventEdit(DEFAULT_EVENT_PROPS);
  }

  renderEventEdit(event) {
    this.renderEventItem((container) => {
      const city = this.eventsModel.getCityById(event.destination);
      const offers = this.eventsModel.getOffersByType(event.type);
      render(
        new EventEditView({
          event: event,
          city: city,
          cities: this.cities,
          offers: offers,
        }),
        container.getElement()
      );
    });
  }

  renderTripPoints() {
    for (let i = 0; i < this.events.length; i++) {
      this.renderEventItem((container) => {
        const event = this.events[i];
        const city = this.eventsModel.getCityById(event.destination);
        const offers = this.eventsModel.getSelectedOffers(
          event.type,
          event.offers
        );
        render(
          new EventView({ event: event, city: city, offers: offers }),
          container.getElement()
        );
      });
    }
  }

  init() {
    this.events = [...this.eventsModel.getEvents()];
    this.cities = [...this.eventsModel.getCities()];
    this.offers = [...this.eventsModel.getOffers()];

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);
    this.renderEventEdit(this.events[0]);
    this.renderTripPoints();
  }
}
