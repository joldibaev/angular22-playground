import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { UiTable } from '../ui-table';

export type UiTableSpacerPosition = 'start' | 'end';

@Component({
  selector: 'tr[uiTableSpacer]',
  templateUrl: './ui-table-spacer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-table-spacer',
    'aria-hidden': 'true',
    '[hidden]': 'height() === 0',
  },
})
export class UiTableSpacer {
  readonly position = input.required<UiTableSpacerPosition>({ alias: 'uiTableSpacer' });
  readonly columns = input(1, { transform: numberAttribute });

  private readonly table = inject(UiTable);

  readonly height = computed(() =>
    this.position() === 'start' ? this.table.topSpacerHeight() : this.table.bottomSpacerHeight(),
  );
}
