import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { nextId } from '../../shared/unique-id';
import {
  UI_RADIO_GROUP,
  type UiRadioSize,
} from './ui-radio-group/ui-radio-group.token';

@Component({
  selector: 'ui-radio',
  templateUrl: './ui-radio.html',
  styleUrl: './ui-radio.css',
  host: {
    '[class.ui-radio-sm]': "effectiveSize() === 'sm'",
  },
})
export class UiRadio {
  readonly value = input.required<string>();
  // Undefined inherits the group's size; a set value overrides it for this radio.
  readonly size = input<UiRadioSize | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('');

  private readonly id = nextId();
  readonly controlId = `ui-radio-control-${this.id}`;

  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');
  readonly group = inject(UI_RADIO_GROUP);

  readonly checked = computed(() => this.group.value() === this.value());
  readonly isDisabled = computed(() => this.disabled() || this.group.disabled());
  readonly effectiveSize = computed(() => this.size() ?? this.group.size());

  onChange(event: Event): void {
    const control = event.target as HTMLInputElement;

    if (control.checked) {
      this.group.select(this.value());
    }
  }

  focus(options?: FocusOptions): void {
    this.control()?.nativeElement.focus(options);
  }
}
