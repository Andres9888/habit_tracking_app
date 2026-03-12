const ROOT_ELEMENT_ID = 'root';

export function getRootElement(): HTMLElement {
  const rootElement = document.querySelector<HTMLElement>(`#${ROOT_ELEMENT_ID}`);

  if (!rootElement) {
    throw new Error(`Root element with id "${ROOT_ELEMENT_ID}" not found in HTML`);
  }

  return rootElement;
}
