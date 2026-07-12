import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionHarness } from '@angular/aria/accordion/testing';
import { UiAccordion } from '../ui-accordion';
import { UiAccordionItem } from './ui-accordion-item';

@Component({
  imports: [UiAccordion, UiAccordionItem],
  template: `
    <ui-accordion>
      <ui-accordion-item
        label="Account"
        [disabled]="disabled()"
        [headingLevel]="4"
        [(expanded)]="expanded"
      >
        <span slot="start" aria-hidden="true">S</span>
        <span slot="end" aria-hidden="true">E</span>
        <input aria-label="Remembered value" value="draft" />
      </ui-accordion-item>
      <ui-accordion-item label="Security">Security content</ui-accordion-item>
    </ui-accordion>
  `,
})
class TestHost {
  readonly expanded = signal(false);
  readonly disabled = signal(false);
}

async function createFixture(): Promise<ComponentFixture<TestHost>> {
  const fixture = TestBed.createComponent(TestHost);
  await fixture.whenStable();
  return fixture;
}

function dispatchKey(element: HTMLElement, key: string): void {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('UiAccordionItem', () => {
  it('renders an accessible trigger and linked region with the configured heading level', async () => {
    const fixture = await createFixture();
    const trigger = fixture.nativeElement.querySelector('[ngAccordionTrigger]') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('[ngAccordionPanel]') as HTMLElement;
    const heading = fixture.nativeElement.querySelector('[role="heading"]') as HTMLElement;

    expect(trigger.textContent).toContain('Account');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(heading.getAttribute('aria-level')).toBe('4');
    expect(trigger.querySelector('[slot="start"]')?.textContent).toBe('S');
    expect(trigger.querySelector('[slot="end"]')?.textContent).toBe('E');
    expect(panel.querySelector('[slot]')).toBeNull();
  });

  it('two-way binds expansion and preserves lazy content after collapse', async () => {
    const fixture = await createFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const accordion = await loader.getHarness(AccordionHarness);

    expect(fixture.nativeElement.querySelector('input')).toBeNull();

    await accordion.expand();
    expect(fixture.componentInstance.expanded()).toBe(true);

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('draft');
    input.value = 'kept';

    await accordion.collapse();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('kept');
  });

  it('exposes the disabled state and ignores activation', async () => {
    const fixture = await createFixture();
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const accordion = await loader.getHarness(AccordionHarness);

    expect(await accordion.isDisabled()).toBe(true);
    await accordion.toggle();
    expect(await accordion.isExpanded()).toBe(false);
  });

  it('moves roving focus with ArrowDown', async () => {
    const fixture = await createFixture();
    const triggers = Array.from(
      fixture.nativeElement.querySelectorAll('[ngAccordionTrigger]') as NodeListOf<HTMLElement>,
    );

    triggers[0].focus();
    dispatchKey(triggers[0], 'ArrowDown');
    await fixture.whenStable();

    expect(document.activeElement).toBe(triggers[1]);
  });
});
