import ComponentSimpleView from '../component-simple-view';

export default class EventListView extends ComponentSimpleView {
  createComponentTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }
}
