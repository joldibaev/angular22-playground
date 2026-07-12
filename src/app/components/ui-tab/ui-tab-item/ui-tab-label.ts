import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[uiTabLabel]',
})
export class UiTabLabel {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
