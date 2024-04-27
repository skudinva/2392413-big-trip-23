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

  constructor ({mainContainer}){
    this.mainContainer = mainContainer;
  }

  init() {
    render(this.mainComponent, this.mainContainer);
    render(this.tripComponent, this.mainComponent.getElement());

    const tripEventElement = this.tripComponent.getElement();
    render(this.sortComponent, tripEventElement);

    render(this.eventListComponet, tripEventElement);
    for (let i = 0; i < 4; i++) {
      const eventItemComponent = new EventItemView();
      render(eventItemComponent, this.eventListComponet.getElement());
      render((i === 0) ? this.editComponent : new EventView(), eventItemComponent.getElement());
    }
  }
}
