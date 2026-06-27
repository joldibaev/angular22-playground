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

export type UiMenuItemVariant = 'default' | 'destructive';

@Component({
  selector: 'ui-menu-item',
  imports: [],
  templateUrl: './ui-menu-item.html',
  host: { class: 'hidden' },
})
export class UiMenuItem {
  readonly element = inject(ElementRef<HTMLElement>);
  readonly template = viewChild.required<TemplateRef<unknown>>('content');

  value = input.required<string>();
  variant = input<UiMenuItemVariant>('default');
  disabled = input(false, { transform: booleanAttribute });

  label = computed(() => {
    const element = this.element.nativeElement;
    return (element.textContent ?? element.innerText).trim();
  });
}
