import { TestBed } from '@angular/core/testing';
import { TableShowcase } from './table-showcase';
describe('TableShowcase', () => {
  it('documents presentation, sorting, actions, and virtualization', async () => {
    const f = TestBed.createComponent(TableShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
    expect(f.nativeElement.textContent).toContain('Virtual and incremental loading');
  });
});
