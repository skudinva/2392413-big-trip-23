import ComponentSimpleView from '../component-simple-view';

export default class NewEventButtonView extends ComponentSimpleView {
  createComponentTemplate() {
    return '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>';
  }
}
