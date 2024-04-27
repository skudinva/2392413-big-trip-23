import { render } from '../render';
import EventEditView from '../view/event-edit-view';
import EventItemView from '../view/event-item-view';
import EventListView from '../view/event-list-view';
import EventView from '../view/event-view';
import SortView from '../view/sort-view';

export default class EventPresenter {
  sortComponent = new SortView();
  eventListComponet = new EventListView();

  constructor({ container, eventsModel }) {
    this.container = container;
    this.eventsModel = eventsModel;
  }

  renderEventItem(callback) {
    const itemComponent = new EventItemView();
    render(itemComponent, this.eventListComponet.getElement());
    callback(itemComponent);
  }

  renderEventEdit() {
    this.renderEventItem((container) => {
      const event = this.events[0];
      const offers = this.eventsModel.getOffersByType(event.type);
      const city = this.eventsModel.getCityById(event.destination);
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
    render(this.eventListComponet, this.container);
    this.renderEventEdit();
    this.renderTripPoints();
  }
}
