import { Component, computed, ElementRef, inject, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'ui-menu-item',
  imports: [],
  templateUrl: './ui-menu-item.html',
  styleUrl: './ui-menu-item.css',
})
export class UiMenuItem {
  readonly element = inject(ElementRef<HTMLElement>);
  readonly template = viewChild.required<TemplateRef<unknown>>('content');

  value = input.required<string>();
  disabled = input(false);

  label = computed(() => {
    const element = this.element.nativeElement;
    return (element.textContent ?? element.innerText).trim();
  });
}
