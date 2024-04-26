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

  init() {
    this.events = [...this.eventsModel.getEvents()];
    this.cities = [...this.eventsModel.getCities()];
    this.offers = [...this.eventsModel.getOffers()];
    render(this.mainComponent, this.mainContainer);
    render(this.tripComponent, this.mainComponent.getElement());

    const tripEventElement = this.tripComponent.getElement();
    render(this.sortComponent, tripEventElement);
    render(this.eventListComponet, tripEventElement);

    const editorItemComponent = new EventItemView(); //1
    render(editorItemComponent, this.eventListComponet.getElement()); //2

    const event = this.events[0];
    const offers = this.eventsModel.getOffersByType(event.type);
    render(
      new EventEditView({
        event: event,
        cities: this.cities,
        offers: offers,
      }),
      editorItemComponent.getElement()
    );

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const city = this.eventsModel.getCityById(event.destination);
      const offers = this.eventsModel.getSelectedOffers(
        event.type,
        event.offers
      );
      const eventItemComponent = new EventItemView(); //1
      render(eventItemComponent, this.eventListComponet.getElement()); //2
      render(
        new EventView({ event: event, city: city, offers: offers }),
        eventItemComponent.getElement()
      );
    }
  }
}
