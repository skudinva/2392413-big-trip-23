import CitiesModel from './model/cities-model';
import EventsModel from './model/events-model';
import EventPresenter from './presenter/event-presenter';

const renderMain = () => {
  const mainElement = document.querySelector('.page-main');
  const eventsModel = new EventsModel();
  const citiesModel = new CitiesModel();
  const eventPresenter = new EventPresenter({
    mainContainer: mainElement,
    eventsModel,
    citiesModel,
  });
  eventPresenter.init();
};

export { renderMain };
