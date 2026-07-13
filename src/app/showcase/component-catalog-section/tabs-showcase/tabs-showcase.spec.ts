import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TabsShowcase } from './tabs-showcase';
describe('TabsShowcase', () => {
  it('documents variants, orientation, selection behavior, and control', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const f = TestBed.createComponent(TabsShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(5);
    expect(f.nativeElement.textContent).toContain('Selection behavior');
  });
});
