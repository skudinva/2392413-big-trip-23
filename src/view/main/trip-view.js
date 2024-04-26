import ComponentSimpleView from '../component-simple-view';

export default class TripView extends ComponentSimpleView {
  createComponentTemplate() {
    return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    </section>`;
  }
}
