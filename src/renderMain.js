import EventsModel from './model/events-model';
import EventPresenter from './presenter/event-presenter';

const renderMain = () => {
  const mainElement = document.querySelector('.page-main');
  const eventModel = new EventsModel();
  const eventPresenter = new EventPresenter({mainContainer: mainElement, eventModel});
  eventPresenter.init();
};

export { renderMain };
