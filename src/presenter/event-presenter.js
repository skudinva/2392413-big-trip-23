import { DEFAULT_EVENT_PROPS } from '../const';
import { render, replace } from '../framework/render';
import EventEditView from '../view/event-edit-view';
import EventItemView from '../view/event-item-view';
import EventView from '../view/event-view';
import EventsListView from '../view/events-list-view';
import SortView from '../view/sort-view';

export default class EventPresenter {
  #sortComponent = new SortView();
  #eventListComponent = new EventsListView();
  #container = null;
  #eventsModel = null;
  #events = null;
  #cities = null;

  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  #renderEventItem(callback) {
    const itemComponent = new EventItemView();
    render(itemComponent, this.#eventListComponent.element);
    callback(itemComponent);
  }

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
  }

  #renderTripPoint(event) {
    this.#renderEventItem((container) => {
      const city = this.#eventsModel.getCityById(event.destination);
      const offers = this.#eventsModel.getOffersByType(event.type);
      const selectedOffers = this.#eventsModel.getSelectedOffers(
        event.type,
        event.offers
      );

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape') {
          evt.preventDefault();
          closeEditForm();
        }
      };

      const eventComponent = new EventView({
        event,
        city,
        selectedOffers,
        onEditClick: () => {
          replaceCardToForm();
          document.addEventListener('keydown', onEscKeyDown);
        },
      });

      const eventEditComponent = new EventEditView({
        event: event,
        city: city,
        cities: this.#cities,
        offers: offers,
        onSubmit: () => {
          closeEditForm();
        },
        onCancel: () => {
          closeEditForm();
        },
        onReset: () => {
          closeEditForm();
        },
      });

      function closeEditForm() {
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }

      function replaceCardToForm() {
        replace(eventEditComponent, eventComponent);
      }

      function replaceFormToCard() {
        replace(eventComponent, eventEditComponent);
      }

      render(eventComponent, container.element);
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
