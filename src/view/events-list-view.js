import ComponentSimpleView from './component-simple-view';

export default class EventsListView extends ComponentSimpleView {
  createComponentTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }
}
