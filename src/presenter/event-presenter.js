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
  editComponent = new EventEditView();

  constructor ({mainContainer, eventModel}){
    this.mainContainer = mainContainer;
    this.eventModel = eventModel;
  }

  init() {
    this.events = [...this.eventModel.getEvents()];
    render(this.mainComponent, this.mainContainer);
    render(this.tripComponent, this.mainComponent.getElement());

    const tripEventElement = this.tripComponent.getElement();
    render(this.sortComponent, tripEventElement);

    render(this.eventListComponet, tripEventElement);

    const editorItemComponent = new EventItemView();
    render(editorItemComponent, this.eventListComponet.getElement());
    render(this.editComponent, editorItemComponent.getElement());

    for (let i = 0; i < this.events.length; i++) {
      const eventItemComponent = new EventItemView();
      render(eventItemComponent, this.eventListComponet.getElement());
      render(new EventView({event: this.events[i]}), eventItemComponent.getElement());
    }
  }
}
