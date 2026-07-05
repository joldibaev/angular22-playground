import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiMask } from '../../../components/ui-mask/ui-mask';
import { UiTable } from '../../../components/ui-table/ui-table';
import { UiTableViewport } from '../../../components/ui-table/ui-table-viewport/ui-table-viewport';
import { MaskShowcase } from './mask-showcase';

describe('MaskShowcase', () => {
  it('documents tokens, behavior, and interactive examples with project components', async () => {
    const fixture = TestBed.createComponent(MaskShowcase);
    await fixture.whenStable();

    expect(fixture.debugElement.queryAll(By.directive(UiTable))).toHaveLength(2);
    expect(fixture.debugElement.queryAll(By.directive(UiTableViewport))).toHaveLength(2);
    expect(fixture.debugElement.queryAll(By.directive(UiMask))).toHaveLength(3);
    expect(fixture.nativeElement.textContent).toContain('separator.N');
    expect(fixture.nativeElement.textContent).toContain('does not make it valid or complete');
  });
});
