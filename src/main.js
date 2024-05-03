import { render } from './framework/render';
import EventsModel from './model/events-model';
import EventPresenter from './presenter/event-presenter';
import TripPresenter from './presenter/trip-presenter';
import FilterView from './view/filter-view';

const eventsModel = new EventsModel();

const renderHeader = () => {
  const headerContainer = document.querySelector(
    '.page-header .page-header__container'
  );
  const tripControlElement = headerContainer.querySelector(
    '.trip-controls__filters'
  );

  const containerElement = headerContainer.querySelector('.trip-main');
  const tripPresenter = new TripPresenter({
    container: containerElement,
    eventsModel,
  });
  tripPresenter.init();

  render(new FilterView(), tripControlElement);
};

const renderMain = () => {
  const containerElement = document.querySelector('.page-main .trip-events');
  const newEventButtonElement = document.querySelector(
    '.trip-main__event-add-btn'
  );

  const eventPresenter = new EventPresenter({
    container: containerElement,
    eventsModel,
    newEventButtonElement: newEventButtonElement,
  });
  eventPresenter.init();
};

renderHeader();
renderMain();
