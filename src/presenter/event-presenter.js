import {
  DEFAULT_EVENT_PROPS,
  DEFAULT_FILTER_TYPE,
  DEFAULT_SORT_TYPE,
  EditFormMode,
  EventStateAction,
  NoEventMessage,
  TimeLimit,
  UpdateType,
  UserAction,
} from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { isNewEventPresenter } from '../utils/event';
import { filterEvents } from '../utils/filter-events';
import { sortEvents } from '../utils/sort-events';
import EventItemView from '../view/event-item-view';
import EventsListView from '../view/events-list-view';
import LoadingView from '../view/loading-view';
import NoEventsView from '../view/no-events-view';
import SortView from '../view/sort-view';
import EventPointPresenter from './event-point-presenter';
import NewEventPointPresenter from './new-event-point-presenter';

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
  #newEventPointPresenter = null;
  /**@type {EventPointPresenter} */
  #activeEventEditForm = null;
  /**@type {HTMLElement} */
  #newEventButtonElement = null;
  /**@type {Map<string, EventPointPresenter, NewEventPointPresenter>} */
  #eventPointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #isLoading = true;
  #isError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

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
    return isNewEventPresenter(this.#activeEventEditForm);
  };

  /**
   *
   * @param {EventPointPresenter} eventPointPresenter
   * @param {String} stateAction
   */
  #onEventEditStateChange = (eventPointPresenter, stateAction) => {
    if (stateAction === EventStateAction.OPEN_EDIT_FORM) {
      this.#openEditForm(eventPointPresenter);
      return;
    }

    if (stateAction === EventStateAction.CLOSE_EDIT_FORM) {
      if (isNewEventPresenter(eventPointPresenter)) {
        eventPointPresenter.destroy();
      } else {
        eventPointPresenter.resetEditForm();
        eventPointPresenter.switchToView();
      }

      this.#setActiveEventEditForm(null);
      this.#renderFilterNoEventComponent();
    }
  };

  #onModelEvent = (updateType, event) => {
    this.#isError = updateType === UpdateType.ERROR;
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
      case UpdateType.ERROR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
    }
  };

  /**
   *
   * @param {EventPointPresenter} activeForm
   * @param {*} callback
   */
  #trySendRequest = async (activeForm, callback) => {
    this.#uiBlocker.block();
    try {
      await callback();
    } catch (error) {
      activeForm.setAborting();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #onEventDataChange = async (actionType, updateType, event) => {
    /**@type {EventPointPresenter} */
    const activeForm =
      actionType === UserAction.ADD_EVENT
        ? this.#activeEventEditForm
        : this.#eventPointPresenters.get(event.id);

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        await this.#trySendRequest(activeForm, async () => {
          activeForm.setSaving();
          await this.#eventsModel.updateEvent(updateType, event);
        });
        break;
      case UserAction.ADD_EVENT:
        await this.#trySendRequest(activeForm, async () => {
          activeForm.setSaving();
          await this.#eventsModel.addEvent(updateType, event);
        });
        break;
      case UserAction.DELETE_EVENT:
        await this.#trySendRequest(activeForm, async () => {
          activeForm.setDeleting();
          await this.#eventsModel.deleteEvent(updateType, event);
        });
        break;
    }
  };

  /**
   *
   * @param {EventPointPresenter} eventPointPresenter
   */
  #openEditForm = (eventPointPresenter) => {
    if (this.#activeEventEditForm) {
      if (isNewEventPresenter(this.#activeEventEditForm)) {
        this.#activeEventEditForm.destroy();
      } else {
        this.#activeEventEditForm.resetEditForm();
        this.#activeEventEditForm.switchToView();
      }
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
      const classPresenter =
        editFormMode === EditFormMode.NEW
          ? NewEventPointPresenter
          : EventPointPresenter;

      const eventPointPresenter = new classPresenter({
        event,
        eventsModel: this.#eventsModel,
        cities: this.#cities,
        offersList: this.#offersList,
        container,
        onStateChange: this.#onEventEditStateChange,
        onDataChange: this.#onEventDataChange,
      });
      if (event.id) {
        this.#eventPointPresenters.set(event.id, eventPointPresenter);
      }
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
    if (this.#renderErrorNoEventComponent()) {
      return;
    }

    if (this.#renderLoadingComponent()) {
      return;
    }

    if (this.#renderFilterNoEventComponent()) {
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderTripPoints();
  };

  #renderErrorNoEventComponent = () => {
    if (this.#isError) {
      this.#renderNoEventComponent(NoEventMessage[UpdateType.ERROR]);
      return true;
    }
    return false;
  };

  #renderFilterNoEventComponent = () => {
    if (!this.events.length) {
      this.#renderNoEventComponent(
        NoEventMessage[this.#filtersModel.currentFilterType]
      );
      return true;
    }
    return false;
  };

  #renderLoadingComponent = () => {
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#container);
      return true;
    }
    return false;
  };

  #renderNoEventComponent = (message) => {
    this.#noEventsComponent = new NoEventsView({
      message,
    });
    render(this.#noEventsComponent, this.#container);
  };

  #renderNewEvent = () => {
    if (
      this.#filtersModel.currentFilterType !== DEFAULT_FILTER_TYPE ||
      this.#currentSortType !== DEFAULT_SORT_TYPE
    ) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#filtersModel.setCurrentFilterType(
        UpdateType.MAJOR,
        DEFAULT_FILTER_TYPE
      );
    }
    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
      render(this.#eventListComponent, this.#container);
    }
    this.#renderTripPoint(DEFAULT_EVENT_PROPS, EditFormMode.NEW);
  };

  #clearTripBoard = ({ resetSort } = {}) => {
    if (resetSort) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noEventsComponent);
    if (this.#activeEventEditForm) {
      this.#activeEventEditForm.destroy();
    }
    this.#eventPointPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPointPresenters.clear();
    this.#setActiveEventEditForm(null);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#onEventEditStateChange(
        this.#activeEventEditForm,
        EventStateAction.CLOSE_EDIT_FORM
      );
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
