import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiTableViewport } from './ui-table-viewport';

@Component({
  imports: [UiTableViewport],
  template: `<section uiTableViewport></section>`,
})
class ViewportTestHost {}

describe('UiTableViewport', () => {
  it('enhances any host element without owning its height', async () => {
    const fixture = TestBed.createComponent(ViewportTestHost);
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(element.classList.contains('ui-table-viewport')).toBe(true);
    expect(element.style.height).toBe('');
  });

  it('publishes current scroll metrics', async () => {
    const fixture = TestBed.createComponent(ViewportTestHost);
    await fixture.whenStable();
    const debugElement = fixture.debugElement.query(By.directive(UiTableViewport));
    const viewport = debugElement.injector.get(UiTableViewport);
    const element = debugElement.nativeElement as HTMLElement;
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 240 });
    element.scrollTop = 96;

    element.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    expect(viewport.viewportHeight()).toBe(240);
    expect(viewport.scrollTop()).toBe(96);
  });
});
