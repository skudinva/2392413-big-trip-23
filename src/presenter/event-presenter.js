import { render } from '../render';
import EventEditView from '../view/main/event-edit-view';
import EventItemView from '../view/main/event-item-view';
import EventListView from '../view/main/event-list-view';
import EventView from '../view/main/event-view';
import MainView from '../view/main/main-view';
import SortView from '../view/main/sort-view';
import TripView from '../view/main/trip-view';

export default class EventPresenter {
  mainComponent = new MainView();
  tripComponent = new TripView();
  sortComponent = new SortView();
  eventListComponet = new EventListView();

  constructor({ mainContainer, eventsModel }) {
    this.mainContainer = mainContainer;
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
      render(
        new EventEditView({
          event: event,
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
    render(this.mainComponent, this.mainContainer);
    render(this.tripComponent, this.mainComponent.getElement());

    const tripEventElement = this.tripComponent.getElement();
    render(this.sortComponent, tripEventElement);
    render(this.eventListComponet, tripEventElement);
    this.renderEventEdit();
    this.renderTripPoints();
  }
}
