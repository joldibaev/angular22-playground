import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ui-tab-item',
  imports: [],
  templateUrl: './ui-tab-item.html',
  styleUrl: './ui-tab-item.css',
})
export class UiTabItem {
  readonly element = inject(ElementRef<HTMLElement>);
  readonly template = viewChild.required<TemplateRef<unknown>>('content');

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
