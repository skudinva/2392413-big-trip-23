import {
  DEFAULT_EVENT_PROPS,
  DEFAULT_FILTER_TYPE,
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
import LoadingView from '../view/loading-view';
import NoEventsView from '../view/no-events-view';
import SortView from '../view/sort-view';
import EventPointPresenter from './event-point-presenter';

export default class EventPresenter {
  #sortComponent = null;
  #noEventsComponent = null;
  #eventListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  /**@type {HTMLElement} */
  #container = null;
  #eventsModel = null;
  #filtersModel = null;
  #cities = null;
  #offersList = null;
  /**@type {EventPointPresenter} */
  #activeEventEditForm = null;
  /**@type {HTMLElement} */
  #newEventButtonElement = null;
  /**@type {Map<string, EventPointPresenter>} */
  #eventPointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #isLoading = true;

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
    return this.#activeEventEditForm.editFormMode === EditFormMode.NEW;
  };

  /**
   *
   * @param {EventPointPresenter} eventPointPresenter
   * @param {String} stateAction
   */
  #onEventEditStateChange = (eventPointPresenter, stateAction) => {
    if (
      (eventPointPresenter.editFormMode === EditFormMode.NEW &&
        stateAction === EventStateAction.CREATE_NEW_FORM) ||
      stateAction === EventStateAction.OPEN_EDIT_FORM
    ) {
      this.#openEditForm(eventPointPresenter);
    } else {
      if (eventPointPresenter.editFormMode === EditFormMode.NEW) {
        eventPointPresenter.destroy();
      } else {
        eventPointPresenter.switchToView();
      }
      this.#setActiveEventEditForm(null);
    }
  };

  #onModelEvent = (updateType, event) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPointPresenters.get(event.id).setEvent(event);
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({ resetSort: true });
        this.#renderTripBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#cities = [...this.#eventsModel.cities];
        this.#offersList = [...this.#eventsModel.offers];
        remove(this.#loadingComponent);
        this.#renderTripBoard();
        break;
    }
  };

  #onEventDataChange = async (actionType, updateType, event) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        if (this.#activeEventEditForm) {
          this.#activeEventEditForm.setSaving();
        }
        this.#eventsModel.updateEvent(updateType, event);
        break;
      case UserAction.ADD_EVENT:
        this.#activeEventEditForm.setSaving();
        this.#eventsModel.addEvent(updateType, event);
        break;
      case UserAction.DELETE_EVENT:
        this.#activeEventEditForm.setDeleting();
        this.#eventsModel.deleteEvent(updateType, event);
        break;
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

  #renderEventItem = (editFormMode, callback) => {
    const itemComponent = new EventItemView();
    render(
      itemComponent,
      this.#eventListComponent.element,
      editFormMode === EditFormMode.NEW
        ? RenderPosition.AFTERBEGIN
        : RenderPosition.BEFOREEND
    );
    callback(itemComponent);
  };

  #renderTripPoint = (event, editFormMode) => {
    this.#renderEventItem(editFormMode, (container) => {
      const eventPointPresenter = new EventPointPresenter({
        event,
        eventsModel: this.#eventsModel,
        cities: this.#cities,
        offersList: this.#offersList,
        container,
        onStateChange: this.#onEventEditStateChange,
        onDataChange: this.#onEventDataChange,
      });
      this.#eventPointPresenters.set(event.id, eventPointPresenter);
    });
  };

  #renderTripPoints = () => {
    this.events.forEach((event) => {
      this.#renderTripPoint(event, EditFormMode.EDIT);
    });
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      onSortButtonClick: this.#onSortButtonClick,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#container);
  };

  #renderTripBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filtersModel.setCurrentFilterType(
      UpdateType.MAJOR,
      DEFAULT_FILTER_TYPE
    );

    this.#renderTripPoint(DEFAULT_EVENT_PROPS, EditFormMode.NEW);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container);
  };

  #clearTripBoard = ({ resetSort } = {}) => {
    if (resetSort) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
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
