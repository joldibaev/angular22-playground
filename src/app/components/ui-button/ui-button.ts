import { booleanAttribute, Component, computed, ElementRef, inject, input } from '@angular/core';
import { UiLoading } from '../ui-loading/ui-loading';

export type UiButtonVariant =
  | 'default'
  | 'outline'
  | 'destructive'
  | 'secondary'
  | 'ghost'
  | 'link';
export type UiButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'button[uiButton], a[uiButton]',
  imports: [UiLoading],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
  host: {
    class: 'ui-button',
    '[class.ui-button-default]': "variant() === 'default'",
    '[class.ui-button-outline]': "variant() === 'outline'",
    '[class.ui-button-destructive]': "variant() === 'destructive'",
    '[class.ui-button-secondary]': "variant() === 'secondary'",
    '[class.ui-button-ghost]': "variant() === 'ghost'",
    '[class.ui-button-link]': "variant() === 'link'",
    '[class.ui-button-loading]': 'loading()',
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
  readonly type = input<UiButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
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
