import { booleanAttribute, Component, input, ViewEncapsulation } from '@angular/core';

export type UiFloatingMessageVariant = 'default' | 'inverted' | 'red' | 'danger';

@Component({
  selector: '[uiFloatingMessage]',
  template: '<span class="ui-floating-message-surface"><ng-content /></span>',
  styleUrl: './ui-floating-message.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-floating-message',
    '[class.ui-floating-message-inverted]': 'variant() === "inverted"',
    '[class.ui-floating-message-red]': 'isRedVariant()',
    '[attr.hidden]': 'open() ? null : ""',
  },
})
export class UiFloatingMessage {
  readonly open = input(false, {
    alias: 'uiFloatingMessageOpen',
    transform: booleanAttribute,
  });
  readonly variant = input<UiFloatingMessageVariant>('default', {
    alias: 'uiFloatingMessageVariant',
  });

  isRedVariant(): boolean {
    return this.variant() === 'red' || this.variant() === 'danger';
  }
}
