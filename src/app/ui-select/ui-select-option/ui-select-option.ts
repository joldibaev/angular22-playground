import { Component, computed, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'ui-select-option',
  imports: [],
  templateUrl: './ui-select-option.html',
  styleUrl: './ui-select-option.css',
})
export class UiSelectOption {
  private element = inject(ElementRef<HTMLElement>);

  value = input.required<string>();

  label = computed(() => {
    const element = this.element.nativeElement;
    return element.textContent ?? element.innerText;
  });
}
