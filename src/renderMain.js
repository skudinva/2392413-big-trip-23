import { render } from './render';
import EventEditView from './view/main/event-edit-view';
import EventItemView from './view/main/event-item-view';
import EventView from './view/main/event-view';
import MainView from './view/main/main-view';
import SortView from './view/main/sort-view';

const renderMain = () => {
  const mainElement = document.querySelector('.page-main');
  render(new MainView(), mainElement);

  const mainContainer = mainElement.querySelector('.page-body__container');
  render(new EventView(), mainContainer);
  const tripEventElement = mainContainer.querySelector('.trip-events');

  render(new SortView(), tripEventElement);
  render(new EventItemView(), tripEventElement);
  const tripEventListElement = tripEventElement.querySelector(
    '.trip-events__list .trip-events__item'
  );
  render(new EventEditView(), tripEventListElement);
};

export { renderMain };
