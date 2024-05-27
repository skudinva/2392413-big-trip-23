import {
  EditFormMode,
  EventStateAction,
  UpdateType,
  UserAction,
} from '../const';
import { remove, render } from '../framework/render';
import EventEditView from '../view/event-edit-view';

export default class NewEventPointPresenter {
  #event = null;
  /**@type {Array} */
  #cities = null;
  /**@type {Array} */
  #offersList = null;
  /**@type {EventEditView} */
  #eventEditComponent = null;
  #handleStateChange = null;
  /**@type {HTMLElement} */
  #container = null;
  #handleDataChange = null;

  constructor({
    event,
    container,
    cities,
    offersList,
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
    this.#event = event;
    this.#cities = cities;
    this.#offersList = offersList;
    this.#handleStateChange = onStateChange;
    this.#handleDataChange = onDataChange;

    this.#render();
  }

  get editFormMode() {
    return EditFormMode.NEW;
  }

  get eventPointState() {
    return this.editFormMode;
  }

  resetEditForm = () => {
    this.#eventEditComponent.updateElement(
      EventEditView.parseEventToState(this.#event)
    );
  };

  setSaving = () => {
    if (this.eventPointState === EditFormMode.VIEW) {
      return;
    }
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  };

  destroy = () => {
    remove(this.#eventEditComponent);
    remove(this.#container);
  };

  switchToEdit = () => {};

  #render = () => {
    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      cities: this.#cities,
      offersList: this.#offersList,
      onFormSubmit: (updateEvent) => {
        this.#handleDataChange(
          UserAction.ADD_EVENT,
          UpdateType.MAJOR,
          updateEvent
        );
      },
      onCancelClick: () => {
        this.#handleStateChange(this, EventStateAction.CLOSE_EDIT_FORM);
      },
      onDeleteClick: (deleteEvent) => {
        this.#handleDataChange(
          UserAction.DELETE_EVENT,
          UpdateType.MINOR,
          deleteEvent
        );
      },
    });

    render(this.#eventEditComponent, this.#container.element);
    this.#handleStateChange(this, EventStateAction.OPEN_EDIT_FORM);
  };
}
