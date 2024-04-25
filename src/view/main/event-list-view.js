import ComponentSimpleView from '../component-simple-view';

export default class EventListView extends ComponentSimpleView {
  createComponentTemplace() {
    return '<ul class="trip-events__list"></ul>';
  }
}
