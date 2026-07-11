import { booleanAttribute, Component, computed, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'ui-autocomplete-option',
  imports: [],
  templateUrl: './ui-autocomplete-option.html',
  host: { class: 'hidden' },
})
export class UiAutocompleteOption {
  private element = inject(ElementRef<HTMLElement>);

  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  label = computed(() => {
    const element = this.element.nativeElement;
    return (element.textContent ?? element.innerText).trim();
  });
}
