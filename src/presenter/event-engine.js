import { render, replace } from '../framework/render';
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
  #editState = false;
  #editStateChange = null;
  #formMode = null;

  get editState() {
    return this.#editState;
  }

  set editState(value) {
    if (value === this.#editState) {
      return;
    }

    const handledState = this.#editStateChange
      ? this.#editStateChange(this)
      : true;
    if (!handledState) {
      return;
    }

    if (value) {
      replace(this.#eventEditComponent, this.#eventComponent);
    } else {
      replace(this.#eventComponent, this.#eventEditComponent);
    }

    this.#editState = value;
  }

  constructor({
    event,
    eventsModel,
    container,
    cities,
    editStateChange,
    formMode,
  }) {
    this.#eventsModel = eventsModel;
    this.#event = event;
    this.#cities = cities;
    this.#editStateChange = editStateChange;
    this.#city = this.#eventsModel.getCityById(event.destination);
    this.#offers = [...this.#eventsModel.getOffersByType(event.type)];
    this.#selectedOffers = [
      ...this.#eventsModel.getSelectedOffers(event.type, event.offers),
    ];
    this.#formMode = formMode;

    this.#eventComponent = new EventView({
      event: this.#event,
      city: this.#city,
      selectedOffers: this.#selectedOffers,
      onEditClick: () => {
        this.editState = true;
        document.addEventListener('keydown', this.#onEscKeyDown);
      },
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      city: this.#city,
      cities: this.#cities,
      offers: this.#offers,
      formMode: this.#formMode,
      onSubmit: () => {
        this.#closeEditForm();
      },
      onCancel: () => {
        this.#closeEditForm();
      },
      onReset: () => {
        this.#closeEditForm();
      },
    });

    render(this.#eventComponent, container.element);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };

  #closeEditForm = () => {
    this.editState = false;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  resetEditForm = () => {
    const formElement = this.#eventEditComponent.element;
    formElement.reset();
  };
}
