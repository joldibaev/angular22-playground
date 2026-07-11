import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiIcon } from './ui-icon';
import { ICONS } from './data';

@Component({
  imports: [UiIcon],
  template: `
    <ui-icon name="outline-check" />
    <ui-icon name="outline-search" label="Search" />
    <ui-icon name="outline-x" label="Dismiss" [decorative]="true" />
    <ui-icon name="outline-plus" [width]="20" [height]="24" />
  `,
})
class IconTestHost {}

function getIcons(fixture: ComponentFixture<IconTestHost>): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('ui-icon'));
}

describe('UiIcon', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTestHost],
    }).compileComponents();
  });

  it('should render decorative icons without an accessible name by default', async () => {
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const [icon] = getIcons(fixture);

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('aria-label')).toBeNull();
    expect(icon.getAttribute('role')).toBe('presentation');
    expect(icon.querySelector('svg')).toBeTruthy();
  });

  it('should use label presence to expose an icon as an image', async () => {
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const [, icon] = getIcons(fixture);

    expect(icon.getAttribute('aria-hidden')).toBeNull();
    expect(icon.getAttribute('aria-label')).toBe('Search');
    expect(icon.getAttribute('role')).toBe('img');
  });

  it('should allow decorative to override a label', async () => {
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const [, , icon] = getIcons(fixture);

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('aria-label')).toBeNull();
    expect(icon.getAttribute('role')).toBe('presentation');
  });

  it('should keep an explicitly non-decorative icon hidden when it has no label', async () => {
    const fixture = TestBed.createComponent(UiIcon);
    fixture.componentRef.setInput('name', 'outline-check');
    fixture.componentRef.setInput('decorative', false);
    await fixture.whenStable();

    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.getAttribute('role')).toBe('presentation');
  });

  it('should render configured svg dimensions', async () => {
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const [, , , icon] = getIcons(fixture);
    const svg = icon.querySelector('svg');

    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('should keep Angular sanitization active for generated icon markup', async () => {
    const icons = ICONS as unknown as Record<string, string>;
    const original = icons['outline-check'];
    icons['outline-check'] =
      '<svg onload="globalThis.__iconXss = true"><script>globalThis.__iconXss = true</script><path d="M0 0" /></svg>';

    try {
      const fixture = TestBed.createComponent(IconTestHost);
      await fixture.whenStable();
      const [icon] = getIcons(fixture);

      expect(icon.querySelector('svg')?.hasAttribute('onload')).toBe(false);
      expect(icon.querySelector('script')).toBeNull();
    } finally {
      icons['outline-check'] = original;
    }
  });
});
