/** Keep keyboard focus within an open overlay while preserving native activation. */
export function containFocus(
  event: KeyboardEvent,
  container: HTMLElement,
): void {
  if (event.key !== 'Tab') {
    return;
  }
  const controls = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, summary, [tabindex]',
    ),
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(':disabled, [inert], [inert] *') &&
      element.getClientRects().length > 0,
  );
  const first = controls[0];
  const last = controls.at(-1);
  if (!first || !last) {
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
