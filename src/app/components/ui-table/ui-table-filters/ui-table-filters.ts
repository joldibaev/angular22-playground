import { Directive } from '@angular/core';

@Directive({
  selector: 'tr[uiTableFilters]',
  host: { class: 'ui-table-filters' },
})
export class UiTableFilters {}
