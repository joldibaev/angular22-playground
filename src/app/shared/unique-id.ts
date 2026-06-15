let counter = 0;

/**
 * Returns a process-unique, monotonically increasing integer. Use it to build
 * stable element ids and CSS anchor names (e.g. `ui-input-label-${nextId()}`)
 * instead of declaring a per-component module-level counter.
 */
export function nextId(): number {
  return counter++;
}
