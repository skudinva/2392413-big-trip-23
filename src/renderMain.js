import EventsModel from './model/events-model';
import EventPresenter from './presenter/event-presenter';

const renderMain = () => {
  const containerElement = document.querySelector('.page-main .trip-events');
  const eventsModel = new EventsModel();
  const eventPresenter = new EventPresenter({
    container: containerElement,
    eventsModel,
  });
  eventPresenter.init();
};

export { renderMain };
