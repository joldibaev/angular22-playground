import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiIcon } from './ui-icon';

@Component({
  imports: [UiIcon],
  template: `
    <ui-icon name="outline-check" />
    <ui-icon name="outline-search" label="Search" />
    <ui-icon name="outline-x" label="Dismiss" [decorative]="true" />
    <ui-icon name="outline-plus" [width]="20" [height]="24" />
    <ui-icon name="loading" />
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

  it('should render configured svg dimensions', async () => {
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const [, , , icon] = getIcons(fixture);
    const svg = icon.querySelector('svg');

    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('should expose the loading motion through the host class instead of SMIL', async () => {
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const [, , , , icon] = getIcons(fixture);

    expect(icon.classList.contains('ui-icon-loading')).toBe(true);
    expect(icon.querySelector('animateTransform')).toBeNull();
  });
});
