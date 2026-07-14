import {
  afterRenderEffect,
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UiTab } from '../ui-tab';

/** Keeps opt-in URL state outside the presentation and accessibility component. */
@Directive({
  selector: 'ui-tab[queryParam]',
})
export class UiTabQueryParam {
  readonly queryParam = input.required<string>();

  private readonly tab = inject(UiTab);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly pendingValue = signal<string | undefined>(undefined);
  private readonly routeValue = computed(
    () => this.queryParamMap().get(this.queryParam()) ?? undefined,
  );

  constructor() {
    const subscription = this.tab.tabSelected.subscribe((value) => this.pendingValue.set(value));
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());

    afterRenderEffect(() => {
      const routeValue = this.routeValue();
      const pendingValue = this.pendingValue();

      if (pendingValue) {
        if (routeValue === pendingValue) {
          this.pendingValue.set(undefined);
        }
        return;
      }

      if (
        routeValue &&
        this.tab.enabledItems().some((item) => item.value() === routeValue) &&
        this.tab.selectedTab() !== routeValue
      ) {
        this.tab.selectedTab.set(routeValue);
      }
    });

    afterRenderEffect(() => {
      const pendingValue = this.pendingValue();

      if (!pendingValue || this.routeValue() === pendingValue) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [this.queryParam()]: pendingValue },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }
}
