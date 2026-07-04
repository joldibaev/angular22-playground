import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAvatar } from './ui-avatar';

@Component({
  imports: [UiAvatar],
  template: `<ui-avatar [src]="src()" [name]="name()" size="lg" />`,
})
class TestHost {
  readonly src = signal('');
  readonly name = signal('Ada Lovelace');
}

describe('UiAvatar', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement.querySelector('ui-avatar');
  }

  it('should expose the name as the accessible label and reflect size', () => {
    expect(host().getAttribute('role')).toBe('img');
    expect(host().getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(host().classList.contains('ui-avatar-lg')).toBe(true);
  });

  it('should render initials from the name when there is no image', () => {
    expect(host().querySelector('.ui-avatar-initials')?.textContent?.trim()).toBe('AL');
  });

  it('should render an image when src is set', () => {
    fixture.componentInstance.src.set('https://example.test/a.png');
    fixture.detectChanges();

    const img = host().querySelector('img.ui-avatar-image') as HTMLImageElement | null;

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.test/a.png');
  });

  it('should fall back to initials when the image fails to load', () => {
    fixture.componentInstance.src.set('https://example.test/missing.png');
    fixture.detectChanges();

    const img = host().querySelector('img.ui-avatar-image') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(host().querySelector('img.ui-avatar-image')).toBeNull();
    expect(host().querySelector('.ui-avatar-initials')?.textContent?.trim()).toBe('AL');
  });

  it('should render the user placeholder icon when there is no name or image', () => {
    fixture.componentInstance.name.set('');
    fixture.detectChanges();

    expect(host().querySelector('ui-icon')).toBeTruthy();
    expect(host().getAttribute('role')).toBeNull();
    expect(host().getAttribute('aria-label')).toBeNull();
    expect(host().getAttribute('aria-hidden')).toBe('true');
  });
});
