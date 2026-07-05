import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionHarness } from '@angular/aria/accordion/testing';
import { UiAccordionItem } from './ui-accordion-item/ui-accordion-item';
import { UiAccordion } from './ui-accordion';

@Component({
  imports: [UiAccordion, UiAccordionItem],
  template: `
    <ui-accordion #accordion [multi]="multi()">
      <ui-accordion-item label="First">First content</ui-accordion-item>
      <ui-accordion-item label="Second">Second content</ui-accordion-item>
    </ui-accordion>
  `,
})
class TestHost {
  readonly accordion = viewChild.required(UiAccordion);
  readonly multi = signal(false);
}

async function createFixture(): Promise<ComponentFixture<TestHost>> {
  const fixture = TestBed.createComponent(TestHost);
  await fixture.whenStable();
  return fixture;
}

describe('UiAccordion', () => {
  it('allows only one expanded item in single mode', async () => {
    const fixture = await createFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const [first, second] = await loader.getAllHarnesses(AccordionHarness);

    await first.expand();
    await second.expand();

    expect(await first.isExpanded()).toBe(false);
    expect(await second.isExpanded()).toBe(true);
  });

  it('allows multiple expanded items and exposes expandAll/collapseAll', async () => {
    const fixture = await createFixture();
    fixture.componentInstance.multi.set(true);
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const accordions = await loader.getAllHarnesses(AccordionHarness);

    fixture.componentInstance.accordion().expandAll();
    await fixture.whenStable();
    expect(await Promise.all(accordions.map((item) => item.isExpanded()))).toEqual([true, true]);

    fixture.componentInstance.accordion().collapseAll();
    await fixture.whenStable();
    expect(await Promise.all(accordions.map((item) => item.isExpanded()))).toEqual([false, false]);
  });
});
