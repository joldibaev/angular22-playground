import { TestBed } from '@angular/core/testing';
import { LoadingShowcase } from './loading-showcase';
describe('LoadingShowcase', () => {
  it('documents status semantics and sizes', async () => {
    const fixture = TestBed.createComponent(LoadingShowcase);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('ui-loading[label]')).toBeTruthy();
  });
});
