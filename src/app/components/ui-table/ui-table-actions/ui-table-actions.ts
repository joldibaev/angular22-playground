import { Directive } from '@angular/core';

@Directive({
  selector: 'th[uiTableActions], td[uiTableActions]',
  host: { class: 'ui-table-actions' },
})
export class UiTableActions {}
