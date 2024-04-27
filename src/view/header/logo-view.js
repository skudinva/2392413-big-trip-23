import ComponentSimpleView from '../component-simple-view';

export default class LogoView extends ComponentSimpleView {
  createComponentTemplace() {
    return `<img class="page-header__logo" src="img/logo.png"
    width="42" height="42" alt="Trip logo" />`;
  }
}
