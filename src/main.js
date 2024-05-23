import { ApiConfig } from './const';
import EventsApiService from './events-api-service';
import EventsModel from './model/events-model';
import FiltersModel from './model/filters-model';
import EventPresenter from './presenter/event-presenter';
import FilterPresenter from './presenter/filter-presenter';
import TripPresenter from './presenter/trip-presenter';

const headerContainer = document.querySelector('.page-header__container');
const tripContainerElement = headerContainer.querySelector('.trip-main');
const tripControlElement = headerContainer.querySelector(
  '.trip-controls__filters'
);

const eventsContainerElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector(
  '.trip-main__event-add-btn'
);

const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(ApiConfig),
});
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter({
  container: tripContainerElement,
  eventsModel,
});
const filterPresenter = new FilterPresenter({
  container: tripControlElement,
  filtersModel,
});
const eventPresenter = new EventPresenter({
  container: eventsContainerElement,
  eventsModel,
  filtersModel,
  newEventButtonElement: newEventButtonElement,
});

eventsModel.init().finally(() => {
  tripPresenter.init();
  filterPresenter.init();
  eventPresenter.init();
});
