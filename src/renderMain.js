import EventPresenter from './presenter/event-presenter';

const renderMain = () => {
  const mainElement = document.querySelector('.page-main');
  const eventPresenter = new EventPresenter({mainContainer: mainElement});
  eventPresenter.init();
};

export { renderMain };
