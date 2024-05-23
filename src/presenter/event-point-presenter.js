import {
  EditFormMode,
  EventStateAction,
  UpdateType,
  UserAction,
} from '../const';
import { remove, render, replace } from '../framework/render';
import { getFormMode } from '../utils/event';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';

export default class EventPointPresenter {
  #event = null;
  #eventsModel = null;
  #city = null;
  /**@type {Array} */
  #cities = null;
  /**@type {Array} */
  #offersList = null;
  /**@type {Array} */
  #selectedOffers = null;
  /**@type {EventView} */
  #eventComponent = null;
  /**@type {EventEditView} */
  #eventEditComponent = null;
  #handleStateChange = null;
  /**@type {EventView|EventEditView} */
  #activeComponent = null;
  /**@type {HTMLElement} */
  #container = null;
  #handleDataChange = null;

  constructor({
    event,
    eventsModel,
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
    this.#eventsModel = eventsModel;
    this.#event = event;
    this.#cities = cities;
    this.#offersList = offersList;
    this.#handleStateChange = onStateChange;
    this.#handleDataChange = onDataChange;

    this.#render();
  }

  get editFormMode() {
    return getFormMode(this.#event);
  }

  get eventPointState() {
    if (this.#activeComponent === this.#eventEditComponent) {
      return this.editFormMode;
    }
    return EditFormMode.VIEW;
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

  setSaving = () => {
    if (this.eventPointState === EditFormMode.VIEW) {
      return;
    }
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setDeleting = () => {
    if (this.eventPointState === EditFormMode.VIEW) {
      return;
    }
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  };

  setAborting = () => {
    if (this.eventPointState === EditFormMode.VIEW) {
      this.#eventComponent.shake();
      return;
    }

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
        this.#handleDataChange(UserAction.UPDATE_EVENT, UpdateType.PATCH, {
          ...this.#event,
          isFavorite: !this.#event.isFavorite,
        });
      },
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      cities: this.#cities,
      offersList: this.#offersList,
      onFormSubmit: (updateEvent) => {
        if (this.editFormMode === EditFormMode.NEW) {
          this.#handleDataChange(
            UserAction.ADD_EVENT,
            UpdateType.MAJOR,
            updateEvent
          );
        } else {
          this.#handleDataChange(
            UserAction.UPDATE_EVENT,
            UpdateType.MINOR,
            updateEvent
          );
        }
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
