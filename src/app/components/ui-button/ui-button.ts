import { booleanAttribute, Component, computed, ElementRef, inject, input } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

export type UiButtonAppearance =
  | 'default'
  | 'outline'
  | 'destructive'
  | 'secondary'
  | 'ghost'
  | 'link';
export type UiButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'button[uiButton], a[uiButton]',
  imports: [UiIcon],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  host: {
    class: 'ui-button',
    '[class.ui-button-default]': "resolvedAppearance() === 'default'",
    '[class.ui-button-outline]': "resolvedAppearance() === 'outline'",
    '[class.ui-button-destructive]': "resolvedAppearance() === 'destructive'",
    '[class.ui-button-secondary]': "resolvedAppearance() === 'secondary'",
    '[class.ui-button-ghost]': "resolvedAppearance() === 'ghost'",
    '[class.ui-button-link]': "resolvedAppearance() === 'link'",
    '[class.ui-button-loading]': 'loading()',
    '[attr.type]': 'isButton() ? type() : null',
    '[attr.disabled]': 'isButton() && unavailable() ? "" : null',
    '[attr.appearance]': 'null',
    '[attr.variant]': 'null',
    '[attr.loading]': 'null',
    '[attr.aria-disabled]': '!isButton() && unavailable() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '(click)': 'onClick($event)',
  },
})
export class UiButton {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly appearance = input<UiButtonAppearance>('default');
  readonly variant = input<UiButtonAppearance | undefined>(undefined);
  readonly type = input<UiButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly resolvedAppearance = computed(() => this.variant() ?? this.appearance());
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
