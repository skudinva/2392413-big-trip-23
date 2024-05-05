import { EventStateAction } from '../const';
import { remove, render, replace } from '../framework/render';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';

export default class EventEngine {
  #event = null;
  #eventsModel = null;
  #city = null;
  #cities = null;
  #offers = null;
  #selectedOffers = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #eventStateChange = null;
  #formMode = null;
  #activeComponent = null;
  #container = null;

  get formMode() {
    return this.#formMode;
  }

  constructor({
    event,
    eventsModel,
    container,
    cities,
    eventStateChange,
    formMode,
  }) {
    if (!eventStateChange) {
      throw new Error('Parametr "eventStateChange" doesn\'t exist');
    }
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#event = event;
    this.#cities = cities;
    this.#eventStateChange = eventStateChange;
    this.#city = this.#eventsModel.getCityById(event.destination);
    this.#offers = [...this.#eventsModel.getOffersByType(event.type)];
    this.#selectedOffers = [
      ...this.#eventsModel.getSelectedOffers(event.type, event.offers),
    ];
    this.#formMode = formMode;
    this.#render();
  }

  #render = () => {
    this.#eventComponent = new EventView({
      event: this.#event,
      city: this.#city,
      selectedOffers: this.#selectedOffers,
      onEditClick: () => {
        this.#eventStateChange(this, EventStateAction.OPEN_EDIT_FORM);
      },
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      city: this.#city,
      cities: this.#cities,
      offers: this.#offers,
      formMode: this.#formMode,
      onSubmit: () => {
        this.#eventStateChange(this, EventStateAction.SUBMIT_EDIT_FORM);
      },
      onCancel: () => {
        this.#eventStateChange(this, EventStateAction.CLOSE_EDIT_FORM);
      },
      onReset: () => {
        this.#eventStateChange(this, EventStateAction.CANCEL_EDIT_FORM);
      },
    });

    this.#activeComponent = this.#eventComponent;
    render(this.#activeComponent, this.#container.element);
    this.#eventStateChange(this, EventStateAction.CREATE_NEW_FORM);
  };

  #swithToComponent = (targetComponent) => {
    if (targetComponent === this.#activeComponent) {
      return;
    }
    replace(targetComponent, this.#activeComponent);
    this.#activeComponent = targetComponent;
  };

  resetEditForm = () => {
    const formElement = this.#eventEditComponent.element;
    formElement.reset();
  };

  swithToEdit = () => {
    this.#swithToComponent(this.#eventEditComponent);
  };

  swithToView = () => {
    this.#swithToComponent(this.#eventComponent);
  };

  destroy = () => {
    remove(this.#container);
  };
}
