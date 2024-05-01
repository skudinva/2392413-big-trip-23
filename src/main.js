import { RenderPosition, render } from './framework/render';
import EventsModel from './model/events-model';
import EventPresenter from './presenter/event-presenter';
import FilterView from './view/filter-view';
import TripInfoView from './view/trip-info-view';

const renderHeader = () => {
  const headerContainer = document.querySelector(
    '.page-header .page-header__container'
  );
  const headerMainElement = headerContainer.querySelector('.trip-main');
  const tripControlElement = headerContainer.querySelector(
    '.trip-controls__filters'
  );

  render(new TripInfoView(), headerMainElement, RenderPosition.AFTERBEGIN);
  render(new FilterView(), tripControlElement);
};

const renderMain = () => {
  const containerElement = document.querySelector('.page-main .trip-events');
  const eventsModel = new EventsModel();
  const eventPresenter = new EventPresenter({
    container: containerElement,
    eventsModel,
  });
  eventPresenter.init();
};

renderHeader();
renderMain();
