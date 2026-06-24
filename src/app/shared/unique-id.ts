import { inject, Service } from '@angular/core';

/**
 * App-scoped source of monotonically increasing integers. As a root `@Service`,
 * the counter lives on the application injector and therefore resets for every
 * SSR request (each request bootstraps a fresh application). That keeps
 * generated ids identical between the server render and the client, so
 * hydration matches instead of tripping on a counter that would otherwise keep
 * climbing across requests in the same server process.
 */
@Service()
export class UniqueIdCounter {
  private counter = 0;

  next(): number {
    return this.counter++;
  }
}

/**
 * Returns an app-scoped, monotonically increasing integer for building stable
 * element ids and CSS anchor names (e.g. `ui-input-label-${nextId()}`).
 *
 * Must be called from an injection context (a component/directive field
 * initializer or constructor). Deliberately counter-based: do NOT switch to
 * `crypto.randomUUID()`, `crypto.getRandomValues`, a uuid library, or
 * `Math.random()`. Those are non-deterministic and break SSR hydration (which
 * needs identical server/client ids), and `crypto.randomUUID()` additionally
 * requires a secure context (HTTPS), which the plain-HTTP dev server is not.
 */
export function nextId(): number {
  return inject(UniqueIdCounter).next();
}
