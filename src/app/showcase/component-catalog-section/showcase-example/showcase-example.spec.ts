import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseExample } from './showcase-example';

describe('ShowcaseExample', () => {
  let fixture: ComponentFixture<ShowcaseExample>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseExample);
    fixture.componentRef.setInput('heading', 'Default');
    fixture.componentRef.setInput('aria-label', 'Default button example');
    fixture.componentRef.setInput('code', '<button uiButton>Save</button>');
  });

  it('renders the shared example frame with accessible preview and code tabs', async () => {
    await fixture.whenStable();

    const section = fixture.nativeElement.querySelector('section');
    const heading = fixture.nativeElement.querySelector('h5');
    const tab = fixture.nativeElement.querySelector('ui-tab');

    expect(heading.textContent).toContain('Default');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(tab.getAttribute('aria-label')).toBe('Default button example');
    expect(fixture.nativeElement.querySelector('.frame')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('ui-card')).toBeNull();
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('.ui-tab-trigger')).map((trigger) =>
        (trigger as HTMLElement).textContent?.trim(),
      ),
    ).toEqual(['Preview', 'Code']);
  });
});
