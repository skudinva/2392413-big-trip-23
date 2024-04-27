import { RenderPosition, render } from './render';
import FilterView from './view/filter-view';
import TripInfoView from './view/trip-info-view';

const renderHeader = () => {
  const headerContainer = document.querySelector('.page-header__container');
  const headerMainElement = headerContainer.querySelector('.trip-main');
  const tripControlElement = headerContainer.querySelector(
    '.trip-controls__filters'
  );

  render(new TripInfoView(), headerMainElement, RenderPosition.AFTERBEGIN);
  render(new FilterView(), tripControlElement);
};

export { renderHeader };
