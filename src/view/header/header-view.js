import ComponentSimpleView from '../component-simple-view';

export default class HeaderView extends ComponentSimpleView {
  createComponentTemplace() {
    return `<div class="page-body__container page-header__container">
    <div class="trip-main"></div></div>`;
  }
}
