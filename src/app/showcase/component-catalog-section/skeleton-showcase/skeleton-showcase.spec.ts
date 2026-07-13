import { TestBed } from '@angular/core/testing';
import { SkeletonShowcase } from './skeleton-showcase';
describe('SkeletonShowcase', () => {
  it('documents shapes, composition, and animation', async () => {
    const f = TestBed.createComponent(SkeletonShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(3);
    expect(f.nativeElement.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});
