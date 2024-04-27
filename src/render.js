const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.getElement());
}

function renderChain(
  component,
  container,
  callback,
  place = RenderPosition.BEFOREEND
) {
  render(component, container, place);
  if (callback) {
    callback(component);
  }
}

export { RenderPosition, createElement, render, renderChain };
