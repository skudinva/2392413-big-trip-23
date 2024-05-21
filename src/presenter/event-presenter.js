import {
  DEFAULT_EVENT_PROPS,
  DEFAULT_SORT_TYPE,
  EditFormMode,
  EventStateAction,
  UpdateType,
  UserAction,
} from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import { filterEvents } from '../utils/filter-events';
import { sortEvents } from '../utils/sort-events';
import EventItemView from '../view/event-item-view';
import EventsListView from '../view/events-list-view';
import NoEventsView from '../view/no-events-view';
import SortView from '../view/sort-view';
import EventPointPresenter from './event-point-presenter';

export default class EventPresenter {
  #sortComponent = null;
  #noEventsComponent = null;
  #eventListComponent = new EventsListView();
  /**@type {HTMLElement} */
  #container = null;
  #eventsModel = null;
  #filtersModel = null;
  #cities = null;
  /**@type {EventPointPresenter} */
  #activeEventEditForm = null;
  /**@type {HTMLElement} */
  #newEventButtonElement = null;
  /**@type {Map<string, EventPointPresenter>} */
  #eventPointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor({ container, eventsModel, filtersModel, newEventButtonElement }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filtersModel = filtersModel;
    this.#newEventButtonElement = newEventButtonElement;
    this.#eventsModel.addObserver(this.#onModelEvent);
    this.#filtersModel.addObserver(this.#onModelEvent);
  }

  get events() {
    const applyFiltering = filterEvents[this.#filtersModel.currentFilterType];
    const applySorting = sortEvents[this.#currentSortType];
    return applySorting(applyFiltering([...this.#eventsModel.events]));
  }

  init = () => {
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

  #onModelEvent = (updateType, event) => {
    if (updateType === UpdateType.PATCH) {
      const eventPointPresenter = this.#eventPointPresenters.get(event.id);
      eventPointPresenter.setEvent(event);
    } else if (updateType === UpdateType.MINOR) {
      this.#clearTripBoard();
      this.#renderTripBoard();
    } else if (updateType === UpdateType.MAJOR) {
      this.#clearTripBoard();
      this.#renderTripBoard();
    }
  };

  #onEventDataChange = (actionType, updateType, event) => {
    if (actionType === UserAction.UPDATE_EVENT) {
      this.#eventsModel.updateEvent(updateType, event);
    } else if (actionType === UserAction.ADD_EVENT) {
      this.#eventsModel.addEvent(updateType, event);
    } else if (actionType === UserAction.DELETE_EVENT) {
      this.#eventsModel.deleteEvent(updateType, event);
    }
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
    for (let i = 0; i < this.events.length; i++) {
      this.#renderTripPoint(this.events[i], EditFormMode.EDIT);
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      onSortButtonClick: this.#onSortButtonClick,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#container);
  };

  #renderTripBoard = () => {
    if (!this.events.length) {
      this.#noEventsComponent = new NoEventsView({
        currentFilter: this.#filtersModel.currentFilterType,
      });
      render(this.#noEventsComponent, this.#container);
      return;
    }
    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderTripPoints();
  };

  #renderNewEvent = () => {
    this.#renderTripPoint(DEFAULT_EVENT_PROPS, EditFormMode.NEW);
  };

  #clearTripBoard = () => {
    remove(this.#sortComponent);
    remove(this.#noEventsComponent);
    this.#eventPointPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPointPresenters.clear();
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
    this.#currentSortType = sortType;
    this.#clearTripBoard();
    this.#renderTripBoard();
  };
}
