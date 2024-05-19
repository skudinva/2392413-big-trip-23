import {
  DEFAULT_EVENT_PROPS,
  DEFAULT_SORT_TYPE,
  EditFormMode,
  EventStateAction,
  FilterType,
} from '../const';
import { RenderPosition, render } from '../framework/render';
import { updateEvent } from '../utils/common';
import { sortEvents } from '../utils/sort-events';
import EventItemView from '../view/event-item-view';
import EventsListView from '../view/events-list-view';
import NoEventsView from '../view/no-events-view';
import SortView from '../view/sort-view';
import EventPointPresenter from './event-point-presenter';

export default class EventPresenter {
  #sortComponent = null;
  #eventListComponent = new EventsListView();
  /**@type {HTMLElement} */
  #container = null;
  #eventsModel = null;
  #events = null;
  #cities = null;
  /**@type {EventPointPresenter} */
  #activeEventEditForm = null;
  /**@type {HTMLElement} */
  #newEventButtonElement = null;
  /**@type {Map<string, EventPointPresenter>} */
  #eventPointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor({ container, eventsModel, newEventButtonElement }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#newEventButtonElement = newEventButtonElement;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    this.#cities = [...this.#eventsModel.cities];
    this.#renderTripBoard();
    this.#newEventButtonElement.addEventListener('click', () =>
      this.#renderNewEvent()
    );
  };

  /**
   *
   * @param {EventPointPresenter} value
   */
  #setActiveEventEditForm = (value) => {
    this.#activeEventEditForm = value;
    this.#newEventButtonElement.disabled = this.#isNewEventFormActive();

    if (this.#activeEventEditForm) {
      document.addEventListener('keydown', this.#onEscKeyDown);
    } else {
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #isNewEventFormActive = () => {
    if (!this.#activeEventEditForm) {
      return false;
    }
    return this.#activeEventEditForm.formMode === EditFormMode.NEW;
  };

  /**
   *
   * @param {EventPointPresenter} eventPointPresenter
   * @param {String} stateAction
   */
  #onEventEditStateChange = (eventPointPresenter, stateAction) => {
    if (
      (eventPointPresenter.formMode === EditFormMode.NEW &&
        stateAction === EventStateAction.CREATE_NEW_FORM) ||
      stateAction === EventStateAction.OPEN_EDIT_FORM
    ) {
      this.#openEditForm(eventPointPresenter);
    } else {
      if (eventPointPresenter.formMode === EditFormMode.NEW) {
        eventPointPresenter.destroy();
      } else {
        eventPointPresenter.switchToView();
      }
      this.#setActiveEventEditForm(null);
    }
  };

  #onEventDataChange = (event) => {
    this.#events = updateEvent(this.#events, event);
    const eventPointPresenter = this.#eventPointPresenters.get(event.id);
    eventPointPresenter.setEvent(event);
  };

  /**
   *
   * @param {EventPointPresenter} eventPointPresenter
   */
  #openEditForm = (eventPointPresenter) => {
    if (this.#activeEventEditForm) {
      this.#activeEventEditForm.resetEditForm();
    }

    eventPointPresenter.switchToEdit();
    this.#setActiveEventEditForm(eventPointPresenter);
  };

  #renderEventItem = (formMode, callback) => {
    const itemComponent = new EventItemView();
    render(
      itemComponent,
      this.#eventListComponent.element,
      formMode === EditFormMode.NEW
        ? RenderPosition.AFTERBEGIN
        : RenderPosition.BEFOREEND
    );
    callback(itemComponent);
  };

  #renderTripPoint = (event, formMode) => {
    this.#renderEventItem(formMode, (container) => {
      const eventPointPresenter = new EventPointPresenter({
        event,
        eventsModel: this.#eventsModel,
        cities: this.#cities,
        container,
        onStateChange: this.#onEventEditStateChange,
        onDataChange: this.#onEventDataChange,
      });
      this.#eventPointPresenters.set(event.id, eventPointPresenter);
    });
  };

  #renderTripPoints = () => {
    for (let i = 0; i < this.#events.length; i++) {
      this.#renderTripPoint(this.#events[i], EditFormMode.EDIT);
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      onSortButtonClick: this.#onSortButtonClick,
    });
    render(this.#sortComponent, this.#container);
  };

  #renderTripBoard = () => {
    if (!this.#events.length) {
      render(
        new NoEventsView({ currentFilter: FilterType.EVERYTHING }),
        this.#container
      );
      return;
    }
    this.#applySorting(this.#currentSortType);
    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderTripPoints();
  };

  #renderNewEvent = () => {
    this.#renderTripPoint(DEFAULT_EVENT_PROPS, EditFormMode.NEW);
  };

  #clearEventsList = () => {
    this.#eventPointPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPointPresenters.clear();
  };

  #applySorting = (sortType) => {
    sortEvents[sortType](this.#events);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#activeEventEditForm.resetEditForm();
    }
  };

  #onSortButtonClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#applySorting(sortType);
    this.#clearEventsList();
    this.#renderTripPoints();
    this.#currentSortType = sortType;
  };
}
