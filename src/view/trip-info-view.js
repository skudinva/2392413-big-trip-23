import { MAX_LIMIT_TRIP_ROUTE } from '../const';
import AbstractView from '../framework/view/abstract-view';
import { getPeriodString } from '../utils/event';

const getDestinationPath = (destinations) => {
  const delimiter = ' &mdash; ';
  if (destinations.length > MAX_LIMIT_TRIP_ROUTE) {
    return [destinations[0], '...', destinations[destinations.length - 1]].join(
      delimiter
    );
  }
  return destinations.join(delimiter);
};
export default class TripInfoView extends AbstractView {
  #tripInfo = null;
  constructor({ tripInfo }) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    const { destinations, cost, dateFrom, dateTo } = this.#tripInfo;
    const destinationPath = getDestinationPath(destinations);
    const dateInfo = getPeriodString(dateFrom, dateTo, '&nbsp;&mdash;&nbsp;');
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${destinationPath}</h1>

      <p class="trip-info__dates">${dateInfo}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
  }
}
