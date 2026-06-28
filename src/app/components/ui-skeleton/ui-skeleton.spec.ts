import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSkeleton } from './ui-skeleton';

@Component({
  imports: [UiSkeleton],
  template: `
    <ui-skeleton />
    <ui-skeleton shape="circle" />
    <ui-skeleton shape="rectangle" [withAnimation]="false" />
  `,
})
class TestHost {}

describe('UiSkeleton', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function skeletons(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-skeleton'));
  }

  it('should render an animated text placeholder by default', () => {
    const [skeleton] = skeletons();

    expect(skeleton.classList.contains('ui-skeleton-text')).toBe(true);
    expect(skeleton.classList.contains('ui-skeleton-animated')).toBe(true);
  });

  it('should reflect each configured shape on the host', () => {
    const [, circle, rectangle] = skeletons();

    expect(circle.classList.contains('ui-skeleton-circle')).toBe(true);
    expect(rectangle.classList.contains('ui-skeleton-rectangle')).toBe(true);
  });

  it('should allow animation to be disabled', () => {
    const [, , skeleton] = skeletons();

    expect(skeleton.classList.contains('ui-skeleton-animated')).toBe(false);
  });

  it('should stay decorative for assistive technology', () => {
    for (const skeleton of skeletons()) {
      expect(skeleton.getAttribute('aria-hidden')).toBe('true');
      expect(skeleton.hasAttribute('role')).toBe(false);
    }
  });
});
