import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { UiTabLabel } from './ui-tab-label';

@Component({
  selector: 'ui-tab-item',
  imports: [],
  templateUrl: './ui-tab-item.html',
  host: { class: 'hidden' },
})
export class UiTabItem {
  readonly element = inject(ElementRef<HTMLElement>);
  readonly template = viewChild.required<TemplateRef<unknown>>('content');
  readonly labelTemplate = contentChild(UiTabLabel);

  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  label = input<string>();

  readonly displayLabel = computed(() => {
    const label = this.label();

    if (label) {
      return label;
    }

    const element = this.element.nativeElement;
    return (element.textContent ?? element.innerText).trim();
  });
}
