import { EventStateAction } from '../const';
import { remove, render, replace } from '../framework/render';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';

export default class EventPointPresenter {
  #event = null;
  #eventsModel = null;
  #city = null;
  #cities = null;
  #offersList = null;
  #selectedOffers = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #handleStateChange = null;
  #formMode = null;
  #activeComponent = null;
  #container = null;
  #handleDataChange = null;

  constructor({
    event,
    eventsModel,
    container,
    cities,
    formMode,
    onStateChange,
    onDataChange,
  }) {
    if (!onStateChange) {
      throw new Error('Parameter "onStateChange" doesn\'t exist');
    }

    if (!onDataChange) {
      throw new Error('Parameter "onDataChange" doesn\'t exist');
    }

    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#event = event;
    this.#cities = cities;
    this.#handleStateChange = onStateChange;
    this.#handleDataChange = onDataChange;
    this.#offersList = [...this.#eventsModel.offers];

    this.#formMode = formMode;
    this.#render();
  }

  get formMode() {
    return this.#formMode;
  }

  setEvent = (event) => {
    this.#event = event;
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
    this.#render();
  };

  resetEditForm = () => {
    const formElement = this.#eventEditComponent.element;
    formElement.reset();
  };

  switchToEdit = () => {
    this.#switchToComponent(this.#eventEditComponent);
  };

  switchToView = () => {
    this.#switchToComponent(this.#eventComponent);
  };

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
    remove(this.#container);
  };

  #render = () => {
    this.#city = this.#eventsModel.getCityById(this.#event.destination);
    this.#selectedOffers = [
      ...this.#eventsModel.getSelectedOffers(
        this.#event.type,
        this.#event.offers
      ),
    ];
    this.#eventComponent = new EventView({
      event: this.#event,
      city: this.#city,
      selectedOffers: this.#selectedOffers,
      onEditButtonClick: () => {
        this.#handleStateChange(this, EventStateAction.OPEN_EDIT_FORM);
      },
      onFavoriteButtonClick: () => {
        this.#handleDataChange({
          ...this.#event,
          isFavorite: !this.#event.isFavorite,
        });
      },
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      cities: this.#cities,
      offersList: this.#offersList,
      formMode: this.#formMode,
      onSubmit: (updateEvent) => {
        this.#handleDataChange(updateEvent);
        this.#handleStateChange(this, EventStateAction.SUBMIT_EDIT_FORM);
      },
      onCancel: () => {
        this.#handleStateChange(this, EventStateAction.CLOSE_EDIT_FORM);
      },
      onReset: () => {
        this.#handleStateChange(this, EventStateAction.CANCEL_EDIT_FORM);
      },
    });

    this.#activeComponent = this.#eventComponent;
    render(this.#activeComponent, this.#container.element);
    this.#handleStateChange(this, EventStateAction.CREATE_NEW_FORM);
  };

  #switchToComponent = (targetComponent) => {
    if (targetComponent === this.#activeComponent) {
      return;
    }
    replace(targetComponent, this.#activeComponent);
    this.#activeComponent = targetComponent;
  };
}
