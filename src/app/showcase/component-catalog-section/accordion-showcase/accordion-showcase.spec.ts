import { TestBed } from '@angular/core/testing';
import { AccordionShowcase } from './accordion-showcase';

describe('AccordionShowcase', () => {
  it('documents single, multiple, disabled, and programmatic accordion use', async () => {
    const fixture = TestBed.createComponent(AccordionShowcase);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('ui-accordion')).toHaveLength(3);
    expect(text).toContain('Single expansion');
    expect(text).toContain('Multiple and controlled');
    expect(text).toContain('Disabled and programmatic control');
  });

  it('expands and collapses every enabled item from the public controls', async () => {
    const fixture = TestBed.createComponent(AccordionShowcase);
    await fixture.whenStable();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    const expandAll = buttons.find((button) => button.textContent?.trim() === 'Expand all')!;
    const collapseAll = buttons.find((button) => button.textContent?.trim() === 'Collapse all')!;
    const controlled = fixture.nativeElement.querySelectorAll('ui-accordion')[2] as HTMLElement;

    expandAll.click();
    await fixture.whenStable();
    expect(
      Array.from(controlled.querySelectorAll('[ngAccordionTrigger]')).map((trigger) =>
        trigger.getAttribute('aria-expanded'),
      ),
    ).toEqual(['true', 'false', 'true']);

    collapseAll.click();
    await fixture.whenStable();
    expect(
      Array.from(controlled.querySelectorAll('[ngAccordionTrigger]')).map((trigger) =>
        trigger.getAttribute('aria-expanded'),
      ),
    ).toEqual(['false', 'false', 'false']);
  });
});
