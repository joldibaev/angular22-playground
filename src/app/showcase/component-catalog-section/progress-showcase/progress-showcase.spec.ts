import { TestBed } from '@angular/core/testing';
import { ProgressShowcase } from './progress-showcase';
describe('ProgressShowcase', () => {
  it('documents all progress modes', async () => {
    const f = TestBed.createComponent(ProgressShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(3);
  });
});
