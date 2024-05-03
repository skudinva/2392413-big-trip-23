import { DEFAULT_EVENT_PROPS, EditFormMode } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import EventItemView from '../view/event-item-view';
import EventsListView from '../view/events-list-view';
import SortView from '../view/sort-view';
import EventEngine from './event-engine';

export default class EventPresenter {
  #sortComponent = new SortView();
  #eventListComponent = new EventsListView();
  #container = null;
  #eventsModel = null;
  #events = null;
  #cities = null;
  #currentEventEditForm = null;
  #newEventButtonElement = null;

  constructor({ container, eventsModel, newEventButtonElement }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#newEventButtonElement = newEventButtonElement;
  }

  #renderEventItem(formMode, callback) {
    const itemComponent = new EventItemView();
    render(
      itemComponent,
      this.#eventListComponent.element,
      formMode === EditFormMode.NEW
        ? RenderPosition.AFTERBEGIN
        : RenderPosition.BEFOREEND
    );
    callback(itemComponent);
  }

  #eventEditStateChange = (event) => {
    const oldEditState = event.editState;
    if (this.#currentEventEditForm) {
      //Значит есть уже открытая форма редактирования/добавления
      if (this.#currentEventEditForm.formMode === EditFormMode.NEW) {
        //Открыта форма добавления. Удаляем ее.
        remove(this.#currentEventEditForm.container);
      } else if (!oldEditState) {
        //Пытаемся открыть еще одну форму редактирования/добавления.
        //Надо закрыть текущую.
        this.#currentEventEditForm.resetEditForm();
      }
    }
    this.#currentEventEditForm = !oldEditState ? event : null;

    return true;
  };

  #renderEventNew() {
    this.#renderTripPoint(DEFAULT_EVENT_PROPS, EditFormMode.NEW);
  }

  #renderTripPoint(event, formMode) {
    this.#renderEventItem(formMode, (container) => {
      new EventEngine({
        event,
        eventsModel: this.#eventsModel,
        cities: this.#cities,
        container,
        editStateChange: this.#eventEditStateChange,
        formMode,
      });
    });
  }

  #renderTripPoints() {
    for (let i = 0; i < this.#events.length; i++) {
      this.#renderTripPoint(this.#events[i], EditFormMode.EDIT);
    }
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#cities = [...this.#eventsModel.cities];
    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);
    this.#renderTripPoints();
    this.#newEventButtonElement.addEventListener('click', () =>
      this.#renderEventNew()
    );
  }
}
