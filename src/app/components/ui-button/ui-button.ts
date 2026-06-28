import { booleanAttribute, Component, computed, ElementRef, inject, input } from '@angular/core';
import { UiLoading } from '../ui-loading/ui-loading';

export type UiButtonVariant =
  | 'default'
  | 'brand'
  | 'outline'
  | 'destructive'
  | 'secondary'
  | 'ghost'
  | 'link';
export type UiButtonType = 'button' | 'submit' | 'reset';
export type UiButtonSize = 'sm' | 'md';

@Component({
  selector: 'button[uiButton], a[uiButton]',
  imports: [UiLoading],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  host: {
    class: 'ui-button',
    '[class.ui-button-default]': "variant() === 'default'",
    '[class.ui-button-brand]': "variant() === 'brand'",
    '[class.ui-button-outline]': "variant() === 'outline'",
    '[class.ui-button-destructive]': "variant() === 'destructive'",
    '[class.ui-button-secondary]': "variant() === 'secondary'",
    '[class.ui-button-ghost]': "variant() === 'ghost'",
    '[class.ui-button-link]': "variant() === 'link'",
    '[class.ui-button-loading]': 'loading()',
    '[class.ui-button-icon-only]': 'iconOnly()',
    '[class.ui-button-rounded]': 'rounded()',
    '[class.ui-button-fluid]': 'fluid()',
    '[class.ui-button-sm]': "size() === 'sm'",
    '[attr.type]': 'isButton() ? type() : null',
    '[attr.disabled]': 'isButton() && unavailable() ? "" : null',
    '[attr.aria-disabled]': '!isButton() && unavailable() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.tabindex]': '!isButton() && unavailable() ? "-1" : null',
    '(click)': 'onClick($event)',
  },
})
export class UiButton {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly variant = input<UiButtonVariant>('default');
  // Shared control-size scale ('md' default, 'sm' compact) — same axis as the
  // ui-input family so a button lines up with inputs/selects in a form row.
  readonly size = input<UiButtonSize>('md');
  readonly type = input<UiButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  // Keep this explicit instead of inspecting projected DOM: arbitrary icon content stays valid,
  // and the server and client derive the same layout without a MutationObserver.
  readonly iconOnly = input(false, { transform: booleanAttribute });
  // Shape mode (pill corners), not an optional part — named like `disabled`/`loading`, not `with...`.
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  // Unlike passive field loading, an action in flight is unavailable: repeated activation can
  // duplicate a submission or side effect, so loading participates in the disabled behavior.
  readonly loading = input(false, { transform: booleanAttribute });

  readonly unavailable = computed(() => this.disabled() || this.loading());
  readonly isButton = computed(() => this.element.nativeElement.tagName.toLowerCase() === 'button');

  onClick(event: Event): void {
    if (!this.unavailable()) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
