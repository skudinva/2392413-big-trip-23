import { RenderPosition, render } from './render';
import FilterView from './view/header/filter-view';
import HeaderView from './view/header/header-view';
import LogoView from './view/header/logo-view';
import NewEventButtonView from './view/header/new-event-button-view';
import TripInfoView from './view/header/trip-info-view';

const renderHeader = () => {
  const headerElement = document.querySelector('.page-header');
  render(new HeaderView(), headerElement, RenderPosition.AFTERBEGIN);

  const headerContainer = headerElement.querySelector(
    '.page-header__container'
  );
  const headerMainElement = headerContainer.querySelector('.trip-main');
  render(new LogoView(), headerContainer, RenderPosition.AFTERBEGIN);
  render(new TripInfoView(), headerMainElement);
  render(new FilterView(), headerMainElement);
  render(new NewEventButtonView(), headerMainElement);
};

export { renderHeader };
