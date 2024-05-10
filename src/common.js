const updateEvent = (events, update) =>
  events.map((event) => (event.id === update.id ? update : event));

export { updateEvent };
