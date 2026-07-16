import { Directive, input, numberAttribute } from '@angular/core';

export type UiTablePinnedPosition = 'end' | 'start';

@Directive({
  selector: 'th[uiTablePinned], td[uiTablePinned]',
  host: {
    class: 'ui-table-pinned',
    '[class.ui-table-pinned-start]': "position() === 'start'",
    '[class.ui-table-pinned-end]': "position() === 'end'",
    '[style.--ui-table-pinned-offset.px]': 'offset()',
  },
})
export class UiTablePinned {
  readonly position = input.required<UiTablePinnedPosition>({ alias: 'uiTablePinned' });
  readonly offset = input(0, { transform: numberAttribute });
}
