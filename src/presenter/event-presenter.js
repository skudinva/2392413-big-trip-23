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
  #container = null;
  #eventsModel = null;
  #events = null;
  #cities = null;
  #activeEventEditForm = null;
  #newEventButtonElement = null;
  #eventPresenters = new Map();
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
      this.#renderEventNew()
    );
  };

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

  #eventEditStateChange = (event, stateAction) => {
    if (
      (event.formMode === EditFormMode.NEW &&
        stateAction === EventStateAction.CREATE_NEW_FORM) ||
      stateAction === EventStateAction.OPEN_EDIT_FORM
    ) {
      this.#openEditForm(event);
    } else {
      if (event.formMode === EditFormMode.NEW) {
        event.destroy();
      } else {
        event.switchToView();
      }
      this.#setActiveEventEditForm(null);
    }
  };

  #onEventDataChange = (event) => {
    this.#events = updateEvent(this.#events, event);
    this.#eventPresenters.get(event.id).setEvent(event);
  };

  #openEditForm = (event) => {
    if (this.#activeEventEditForm) {
      this.#activeEventEditForm.resetEditForm();
    }

    event.switchToEdit();
    this.#setActiveEventEditForm(event);
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
        onStateChange: this.#eventEditStateChange,
        onDataChange: this.#onEventDataChange,
        formMode,
      });
      this.#eventPresenters.set(event.id, eventPointPresenter);
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

  #renderEventNew = () => {
    this.#renderTripPoint(DEFAULT_EVENT_PROPS, EditFormMode.NEW);
  };

  #clearEventsList = () => {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  };

  #applySorting = (sortType) => {
    const sortMethod = sortEvents[sortType];
    this.#events = sortMethod(this.#events);
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
